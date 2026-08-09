import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    city: ''
  })

  // Where to go after auth
  const from = location.state?.from?.pathname || '/explore'

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/explore'
      }
    })
    if (error) setErrorMsg(error.message)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      if (isSignUp) {
        // Sign up flow
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error

        if (data.user) {
          // Insert into profiles
          const { error: profileError } = await supabase.from('profiles').insert({
            user_id: data.user.id,
            display_name: formData.displayName,
            city: formData.city,
          })
          if (profileError) throw profileError
          navigate(from, { replace: true })
        }
      } else {
        // Sign in flow
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })
        if (error) throw error
        navigate(from, { replace: true })
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] bg-surface flex items-center justify-center px-0 py-8 font-body-md text-on-surface">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[90%] md:w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-[0px_10px_40px_rgba(17,24,39,0.08)] border border-surface-variant p-8 md:p-10 flex flex-col items-center"
      >
        <div className="font-headline-lg font-black text-primary flex items-center gap-1 mb-8 text-3xl">
          StageMap <span className="text-4xl">📍</span>
        </div>

        <h1 className="font-headline-md text-headline-md mb-2">
          {isSignUp ? 'Join the Community' : 'Welcome Back'}
        </h1>
        <p className="text-on-surface-variant font-body-sm text-center mb-8">
          {isSignUp ? 'Discover the best local events.' : 'Sign in to access your saved events and profile.'}
        </p>

        <button 
          onClick={handleGoogleAuth}
          className="w-full bg-primary text-on-primary font-label-md text-label-md px-4 py-3 rounded-xl shadow-sm hover:bg-surface-tint active:scale-95 transition-all flex items-center justify-center gap-2 mb-6"
        >
          <svg className="w-5 h-5 bg-white rounded-full p-1" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="w-full flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-surface-variant"></div>
          <span className="font-label-md text-label-md text-outline">or</span>
          <div className="flex-1 h-px bg-surface-variant"></div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {errorMsg && (
            <div className="bg-error-container text-error font-body-sm p-3 rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          {isSignUp && (
            <>
              <input 
                type="text" 
                placeholder="Display Name" 
                required
                value={formData.displayName}
                onChange={e => setFormData({...formData, displayName: e.target.value})}
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <input 
                type="text" 
                placeholder="City (e.g. Bengaluru)" 
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </>
          )}

          <input 
            type="email" 
            placeholder="Email Address" 
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            required
            minLength={6}
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-headline-sm text-headline-sm px-4 py-3 rounded-xl shadow-sm hover:bg-surface-tint active:scale-95 transition-all mt-2 flex justify-center items-center"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="font-body-sm text-on-surface-variant mt-8 text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg('') }}
            className="text-primary font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
