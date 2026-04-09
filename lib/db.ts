/// <reference types="vite/client" />
import { v4 as uuidv4 } from 'uuid';

// Turso query builder for portfolio database
class TursoQueryBuilder {
  private queryType = 'select'; 
  private selectCols = '*';
  private matchers: string[] = [];
  private orderClauses: string[] = [];
  private insertData: any = null;
  private limitStr = '';
  private isSingle = false;
  private isExactCount = false;

  constructor(private table: string) {}

  select(str = '*', options: any = null) { 
    this.queryType = 'select'; 
    this.selectCols = str; 
    if (options?.count === 'exact') this.isExactCount = true;
    return this; 
  }
  
  insert(data: any) { 
    this.queryType = 'insert'; 
    // Ensure ID exists
    if (Array.isArray(data)) {
        this.insertData = data.map(d => ({ id: uuidv4(), ...d }));
    } else {
        this.insertData = { id: uuidv4(), ...data };
    }
    return this; 
  }

  update(data: any) { 
    this.queryType = 'update'; 
    this.insertData = data; 
    return this; 
  }

  upsert(data: any) {
    this.queryType = 'upsert';
    this.insertData = data;
    return this;
  }

  delete() { this.queryType = 'delete'; return this; }
  
  eq(col: string, val: any) { 
    if (typeof val === 'string') {
        const escaped = val.replace(/'/g, "''");
        this.matchers.push(`${col} = '${escaped}'`); 
    } else {
        this.matchers.push(`${col} = ${val}`); 
    }
    return this; 
  }
  
  order(col: string, opts = { ascending: true }) { 
    this.orderClauses.push(`${col} ${opts.ascending ? 'ASC' : 'DESC'}`); 
    return this; 
  }
  
  limit(n: number) { this.limitStr = ` LIMIT ${n}`; return this; }
  single() { this.isSingle = true; this.limitStr = ` LIMIT 1`; return this; }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  private async execute(): Promise<any> {
    try {
      let sql = '';
      
      if (this.queryType === 'select') {
        if (this.isExactCount) {
             sql = `SELECT COUNT(*) as count FROM ${this.table}`;
             if (this.matchers.length) sql += ` WHERE ${this.matchers.join(' AND ')}`;
             const res = await this.executeSQL(sql);
             return { data: null, count: res.data?.[0]?.count || 0, error: null };
        }
        
        sql = `SELECT ${this.selectCols} FROM ${this.table}`;
        if (this.matchers.length) sql += ` WHERE ${this.matchers.join(' AND ')}`;
        if (this.orderClauses.length) sql += ` ORDER BY ${this.orderClauses.join(', ')}`;
        sql += this.limitStr;
      } 
      
      else if (this.queryType === 'insert') {
         const items = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
         if (items.length === 0) return { data: [], error: null };
         
         const cols = Object.keys(items[0]);
         const valuesList = items.map(item => {
             return "(" + cols.map(c => {
                 const v = item[c];
                 if (v === null || v === undefined) return "NULL";
                 if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
                 return v;
             }).join(", ") + ")";
         }).join(", ");
         
         sql = `INSERT INTO ${this.table} (${cols.join(', ')}) VALUES ${valuesList} RETURNING *`;
      } 
      
      else if (this.queryType === 'update') {
         const items = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
         const item = items[0];
         const setters = Object.keys(item).map(k => {
             const v = item[k];
             if (v === null || v === undefined) return `${k} = NULL`;
             if (typeof v === 'string') return `${k} = '${v.replace(/'/g, "''")}'`;
             return `${k} = ${v}`;
         }).join(", ");
         
         sql = `UPDATE ${this.table} SET ${setters}`;
         if (this.matchers.length) sql += ` WHERE ${this.matchers.join(' AND ')}`;
         sql += " RETURNING *";
      } 
      
      else if (this.queryType === 'delete') {
         sql = `DELETE FROM ${this.table}`;
         if (this.matchers.length) sql += ` WHERE ${this.matchers.join(' AND ')}`;
         sql += " RETURNING *";
      }

      else if (this.queryType === 'upsert') {
         // Naive upsert (replace)
         const items = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
         const cols = Object.keys(items[0]);
         const valuesList = items.map(item => {
             return "(" + cols.map(c => {
                 const v = item[c];
                 if (v === null || v === undefined) return "NULL";
                 if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
                 return v;
             }).join(", ") + ")";
         }).join(", ");
         sql = `REPLACE INTO ${this.table} (${cols.join(', ')}) VALUES ${valuesList} RETURNING *`;
      }

      const res = await this.executeSQL(sql);
      let resData = res.data;
      if (this.isSingle && Array.isArray(res.data)) resData = res.data[0] || null;
      return { data: resData, error: res.error };

    } catch (e) {
      return { data: null, error: e };
    }
  }

  private async executeSQL(query: string) {
      const response = await fetch('/api/db', {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          },
          body: JSON.stringify({ query })
      });
      return await response.json();
  }
}

export const db = {
  from: (table: string) => new TursoQueryBuilder(table),
  
  auth: {
     getSession: async () => {
         const token = localStorage.getItem('admin_token');
         if (token) {
             return { data: { session: { user: { id: "admin" } } }, error: null };
         }
         return { data: { session: null }, error: null };
     },
     signInWithPassword: async ({ email, password }: any) => {
         const cleanEmail = email?.trim() || '';
         const cleanPassword = password?.trim() || '';
         const validEmail = 'hengkishadow@gmail.com';
         const validPassword = (process.env.ADMIN_PASSWORD || 'admin12345').trim();
         
         if ((cleanEmail === validEmail || cleanEmail === 'hengkis123@gmail.com') && cleanPassword === validPassword) {
             localStorage.setItem('admin_token', validPassword);
             return { data: { session: { user: { id: "admin" } } }, error: null };
         }
         
         return { data: null, error: new Error('Email atau Password salah!') };
     },
     signOut: async () => {
         localStorage.removeItem('admin_token');
         return { error: null };
     },
     onAuthStateChange: (cb: any) => {
         const data = { subscription: { unsubscribe: () => {} } };
         return { data };
     }
  },
  
  storage: {
      from: (bucket: string) => ({
          upload: async (path: string, file: File) => {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('path', path);
              
              const res = await fetch('/api/upload', {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
                  body: formData
              });
              const json = await res.json();
              if (json.error) return { data: null, error: new Error(json.error) };
              return { data: { path: json.url }, error: null }; 
          },
          getPublicUrl: (path: string) => {
              return { data: { publicUrl: path } };
          },
          remove: async (paths: string[]) => {
              return { data: null, error: null };
          }
      })
  }
};
