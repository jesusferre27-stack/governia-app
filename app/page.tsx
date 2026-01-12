
export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-navy-dark font-['Poppins']">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <h1 className="text-primary font-['Montserrat'] tracking-tight text-[32px] font-bold leading-tight">GOVERNIA</h1>
        </header>
        
        <main className="bg-card-dark p-8 rounded-xl shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-text-light text-2xl font-bold leading-tight">Staff Login</h3>
            <p className="text-text-muted text-base pt-2">Sign in to access the GOVERNIA portal.</p>
          </div>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-text-light text-sm font-medium pb-2" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">mail</span>
                <input 
                  className="w-full rounded-lg text-text-light border border-border-dark bg-field-dark focus:border-primary h-14 p-3.5 pl-11 text-base outline-none transition-all"
                  id="email" 
                  placeholder="you@yourmunicipality.gov" 
                  type="email" 
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-text-light text-sm font-medium pb-2" htmlFor="password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">lock</span>
                <input 
                  className="w-full rounded-lg text-text-light border border-border-dark bg-field-dark focus:border-primary h-14 p-3.5 pl-11 pr-11 text-base outline-none transition-all"
                  id="password" 
                  placeholder="••••••••••••" 
                  type="password" 
                />
              </div>
              <a className="text-text-muted text-sm font-medium text-right mt-2 hover:text-primary transition-colors" href="#">Forgot Password?</a>
            </div>

            <button className="flex w-full items-center justify-center rounded-lg bg-primary h-14 px-6 text-base font-semibold text-navy-dark hover:bg-opacity-90 transition-all" type="submit">
              Login
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}