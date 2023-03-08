import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch } from "../store";
import React from "react"
import { navbarSizeActions } from "../store/navbar-size";

const RETURNTO: string = "/"

export const Navbar: React.FC = () => {

  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const signIn: boolean = false;
  const navbarRef = React.useRef<HTMLElement>(null)

  const dispatch = useAppDispatch()
  React.useEffect(() => {
    // Updating the state with the size of component to adjust the canvas for mouse position
    if (navbarRef.current) {
      console.log(navbarRef.current.getBoundingClientRect().bottom)
      dispatch(navbarSizeActions.updateHeight(navbarRef.current.getBoundingClientRect().bottom))
    }
  }, [])

  const handleClickLogIn = async (e: React.FormEvent) => {
    await loginWithRedirect({
        appState: {
          returnTo: RETURNTO,
        },
        authorizationParams: {
          prompt: "login",
        },
      });
  }

  const handleClickSignUp = async (e: React.FormEvent) => {
    await loginWithRedirect({
        appState: {
          returnTo: RETURNTO,
        },
        authorizationParams: {
          prompt: "login",
          screen_hint: "signup",
        },
      });
  }

  const handleClickLogOut = (e: React.FormEvent) => {
      logout({
          logoutParams: {
              returnTo: window.location.origin,
          },
      });
  }

  return (
      <section ref = {navbarRef} className=" flex-none z-20 min-h-0 bg-black text-white text-lg px-1 h-14">
        <div className ="flex flex-row justify-between">
          <h1 className = "p-0.5 m-0.5">Visual Programming Interface</h1>
          <div className = "flex flex-row">
            {!isAuthenticated && <button className = "my-1 px-2 mx-1 border-2 text-white text-sm" onClick = {handleClickLogIn}>Log In</button>}
            {!isAuthenticated && <button className = "my-1 px-2 bg-slate-600 text-white border-2 text-sm"  onClick = {handleClickSignUp}>Sign Up</button>}
            {isAuthenticated && <button className = "my-1 px-2 border-2"  onClick = {handleClickLogOut}>Log Out</button>}
          </div>
        </div>
      </section>
  )
}