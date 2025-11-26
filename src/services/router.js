export const Router = {

    init: () => {
        //
        globalThis.addEventListener('popstate', (event) => {
            console.log(`Navigating back to: ${event.state.route}`);
            Router.go(event.state.route, false);
        });
    },
    go: (route, addToHistory=true) => {
        console.log(`Going to route: + ${route}`);

        if(addToHistory) {
            history.pushState({route}, '', route);
        }
    },
};

export default Router;