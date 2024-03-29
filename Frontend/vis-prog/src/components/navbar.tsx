import { useAuth0 } from "@auth0/auth0-react";
import { useAppDispatch, useAppSelector } from "../store";
import React from "react"
import { navbarSizeActions } from "../store/navbar-size";

const RETURNTO: string = "/"


export const Navbar: React.FC = () => {

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const backendDisabled: boolean = true
  
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

  const appStateWorkspaces = useAppSelector((state) => state.workspaceStateReducers)

  const handleClickLogIn = async (e: React.FormEvent) => {
    if (!backendDisabled) {
      await loginWithRedirect({
          appState: {
            appStateWS: appStateWorkspaces,
            returnTo: RETURNTO,
          },
          authorizationParams: {
            prompt: "login",
          },
        });
      }
  }

  const handleClickSignUp = async (e: React.FormEvent) => {
    if (!backendDisabled) {
      await loginWithRedirect({
          appState: {
            appStateWS: appStateWorkspaces,
            returnTo: RETURNTO,
          },
          authorizationParams: {
            prompt: "login",
            screen_hint: "signup",
          },
        });
    }
  }

  const handleClickLogOut = (e: React.FormEvent) => {
    if (!backendDisabled) {
      logout({
          logoutParams: {
              returnTo: window.location.origin,
          },
      });
    }
  }

  return (
      <section ref = {navbarRef} className=" flex-none z-20 min-h-0 bg-black text-white text-lg px-1 h-14">
        <div className ="flex flex-row justify-between">
          <h1 className = "p-0.5 m-0.5">Visual Calculator</h1>
          <div className = "flex flex-row items-center">
            {backendDisabled &&  <p className = "pt-1 pr-2 text-sm">Back end disabled</p>}
            {!isAuthenticated && <button className = "my-1 px-2 mx-1 border-2 py-1 text-white text-sm" onClick = {handleClickLogIn}>Log In</button>}
            {!isAuthenticated && <button className = "my-1 px-2 py-1 bg-slate-600 text-white border-2 text-sm"  onClick = {handleClickSignUp}>Sign Up</button>}
            {(isAuthenticated && user) && <p className = "pt-1 pr-2">User: {user.name}</p>}
            {isAuthenticated && <button className = "my-1 px-2 border-2 text-white text-sm"  onClick = {handleClickLogOut}>Log Out</button>}
          </div>
        </div>
      </section>
  )
}