import { useAuth0 } from "@auth0/auth0-react";
import React from "react"

export const Navbar: React.FC = () => {

    const signIn: boolean = false;

    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    const RETURNTO: string = "/"

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

    function handleClickLogOut(e: React.FormEvent) {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    }

    return (
        <section className=" flex-none z-20 min-h-0 bg-slate-500 text-lg px-1">
            <div className ="flex flex-row justify-between">
              <h1 className = "p-0.5 m-0.5">Visual Programming Interface</h1>
              <div className = "flex flex-row">
                {!isAuthenticated && <button className = "my-1 px-2 mx-1 border-2 rounded-xl text-white" onClick = {handleClickLogIn}>Log In</button>}
                {!isAuthenticated && <button className = "my-1 px-2 bg-slate-600 text-white border-2 rounded-xl"  onClick = {handleClickSignUp}>Sign Up</button>}
                {isAuthenticated && <button className = "my-1 px-2 border-2"  onClick = {handleClickLogOut}>Log Out</button>}
              </div>
            </div>
        </section>
    )
}