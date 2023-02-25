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
        <section className="bg-blue-100 flex-none z-20 ">
            <div className ="flex flex-row justify-between">
              <h1 className = "p-0.5 m-0.5">Visual Programming Interface</h1>
              <div className = "flex flex-row">
                {!isAuthenticated && <button className = "p-0.5 m-0.5 bg-blue-300" onClick = {handleClickLogIn}>Log In</button>}
                {!isAuthenticated && <button className = "p-0.5 m-0.5 bg-blue-300"  onClick = {handleClickSignUp}>Sign Up</button>}
                {isAuthenticated && <button className = "p-0.5 m-0.5 bg-blue-300"  onClick = {handleClickLogOut}>Log Out</button>}
              </div>
            </div>
        </section>
    )
}