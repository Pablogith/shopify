var ROUTES_INDEX = {
  name: "<root>",
  kind: "module",
  className: "AppModule",
  children: [
    {
      name: "routes",
      filename: "src/app/app-routing.module.ts",
      module: "AppRoutingModule",
      children: [
        { path: "", redirectTo: "home", pathMatch: "full" },
        {
          path: "home",
          loadChildren: "./pages/home-page/home-page.module#HomePageModule",
          children: [
            {
              kind: "module",
              children: [
                {
                  name: "routes",
                  filename:
                    "src/app/pages/home-page/home-page-routing.module.ts",
                  module: "HomePageRoutingModule",
                  children: [{ path: "", component: "HomePageComponent" }],
                  kind: "module",
                },
              ],
              module: "HomePageModule",
            },
          ],
        },
        {
          path: "products",
          loadChildren:
            "./pages/products-page/products-page.module#ProductsPageModule",
          children: [
            {
              kind: "module",
              children: [
                {
                  name: "routes",
                  filename:
                    "src/app/pages/products-page/products-page-routing.module.ts",
                  module: "ProductsPageRoutingModule",
                  children: [{ path: "", component: "ProductsPageComponent" }],
                  kind: "module",
                },
              ],
              module: "ProductsPageModule",
            },
          ],
        },
        {
          path: "sign-in",
          loadChildren:
            "./pages/sign-in-page/sign-in-page.module#SignInPageModule",
          children: [
            {
              kind: "module",
              children: [
                {
                  name: "routes",
                  filename:
                    "src/app/pages/sign-in-page/sign-in-page-routing.module.ts",
                  module: "SignInPageRoutingModule",
                  children: [{ path: "", component: "SignInPageComponent" }],
                  kind: "module",
                },
              ],
              module: "SignInPageModule",
            },
          ],
        },
        {
          path: "**",
          loadChildren:
            "./pages/not-found-page/not-found-page.module#NotFoundPageModule",
          children: [
            {
              kind: "module",
              children: [
                {
                  name: "routes",
                  filename:
                    "src/app/pages/not-found-page/not-found-page-routing.module.ts",
                  module: "NotFoundPageRoutingModule",
                  children: [{ path: "", component: "NotFoundPageComponent" }],
                  kind: "module",
                },
              ],
              module: "NotFoundPageModule",
            },
          ],
        },
      ],
      kind: "module",
    },
  ],
};
