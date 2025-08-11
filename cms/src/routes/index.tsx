import Layout from "../layout";
import Claims from "../views/claims";
import UpsertClaim from "../views/claims/UpsertClaim";
import Config from "../views/Config";

import type { RouteObject } from "react-router-dom";
import { PATHS } from "./paths";
import ClaimDetail from "../views/claims/ClaimDetail";

export const routes: RouteObject[] = [
  {
    path: PATHS.HOME,
    element: <Layout />,
    children: [
      { index: true, element: <Claims /> },
      { path: PATHS.CLAIMS, element: <Claims /> },
      { path: PATHS.CONFIG, element: <Config /> },
      { path: PATHS.UPDATE_CLAIM, element: <UpsertClaim /> },
      { path: PATHS.CREATE_CLAIM, element: <UpsertClaim /> },
      { path: PATHS.CLAIM_DETAIL, element: <ClaimDetail /> },
    ],
  },
];
