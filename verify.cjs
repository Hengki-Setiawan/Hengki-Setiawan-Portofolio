const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dkzaeqnmdlnogjbeucgb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRremFlcW5tZGxub2dqYmV1Y2diIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNjEyMTcsImV4cCI6MjA4MDkzNzIxN30.AWm4F5nIUD7-j8flAsVu7MJt5uvx8IX2xk36f2B3_gI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            console.error('Connection failed:', error.message)
        } else {
            console.log('Connection successful! Session data:', data)
        }
    } catch (err) {
        console.error('Unexpected error:', err)
    }
}

verify()
