import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify';

import { CssBaseline, ThemeProvider, createTheme, styled } from '@mui/material';
import { grey, orange, pink } from '@mui/material/colors';
import { StyledEngineProvider } from '@mui/material/styles';

import {
  GraaspContextDevTool,
  WithLocalContext,
  WithTokenContext,
} from '@graasp/apps-query-client';

import i18nConfig from '@/config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '@/config/queryClient';
import { defaultMockContext, mockMembers } from '@/mocks/db';
import Loader from '@/modules/common/Loader';
import { useObjectState } from '@/utils/hooks';

import App from './App';

// declare the module to enable theme modification
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: { background: string; color: string };
    };
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: { background: string; color: string };
    };
  }

  interface PaletteOptions {
    default: string;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#5050d2',
    },
    secondary: pink,
    default: grey['500'],
    background: {
      default: 'transparent',
      paper: '#fff',
    },
  },
  status: {
    danger: {
      background: orange['400'],
      color: '#fff',
    },
  },
});

const RootDiv = styled('div')({
  flexGrow: 1,
  height: '100%',
});

function Root() {
  const [mockContext, setMockContext] = useObjectState(defaultMockContext);

  return (
    <RootDiv id="root-div">
      {/* Used to define the order of injected properties between JSS and emotion */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <I18nextProvider i18n={i18nConfig}>
            <QueryClientProvider client={queryClient}>
              <ToastContainer />
              <WithLocalContext
                defaultValue={window.Cypress ? window.appContext : mockContext}
                LoadingComponent={<Loader>Context</Loader>}
                useGetLocalContext={hooks.useGetLocalContext}
                useAutoResize={hooks.useAutoResize}
                onError={() => {
                  console.error(
                    'An error occurred while fetching the context.',
                  );
                }}
              >
                <WithTokenContext
                  LoadingComponent={<Loader>Token</Loader>}
                  useAuthToken={hooks.useAuthToken}
                  onError={() => {
                    console.error(
                      'An error occurred while requesting the token.',
                    );
                  }}
                >
                  <App />
                  {import.meta.env.DEV && !window.Cypress && (
                    <GraaspContextDevTool
                      members={mockMembers}
                      context={mockContext}
                      setContext={setMockContext}
                    />
                  )}
                </WithTokenContext>
              </WithLocalContext>
              {import.meta.env.DEV && (
                <ReactQueryDevtools position="bottom-left" />
              )}
            </QueryClientProvider>
          </I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </RootDiv>
  );
}

export default Root;
