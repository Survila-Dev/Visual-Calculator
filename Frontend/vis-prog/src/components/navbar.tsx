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
        <section>
            {!isAuthenticated && <button onClick = {handleClickLogIn}>Log In</button>}
            {!isAuthenticated && <button onClick = {handleClickSignUp}>Sign Up</button>}
            {isAuthenticated && <button onClick = {handleClickLogOut}>Log Out</button>}
        </section>
    )
}