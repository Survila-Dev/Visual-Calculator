import { Auth0Provider, AppState } from "@auth0/auth0-react";
import React, { PropsWithChildren } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { workspacesStateActions } from "./store/workspaces-subroutines/index-workspaces";

interface Auth0ProviderWithNavigateProps {
  children: React.ReactNode;
}

export const Auth0ProviderWithNavigate = ({
  children,
}: PropsWithChildren<Auth0ProviderWithNavigateProps>): JSX.Element | null => {
  const navigate = useNavigate();

  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;
  const dispatch = useDispatch()

  const onRedirectCallback = (appState?: AppState) => {

    //ToDo Set state from appState
    // if (appState) {
    //   dispatch(workspacesStateActions.updateWorkspaces(appState.appStateWS))
    // }
    // appStateWS: appStateWorkspace,
    // appStateCurves: appStateCurves,

    navigate(appState?.returnTo || window.location.pathname);
    // console.log(appState?.someValue)
  };

  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};