import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "@/pages/auth/Login/Login";
import UserGroupDetails from "@/pages/RolesAndAccess/UserGroupDetails";

import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Signup from "@/pages/auth/SignUp/Signup";

import UserManagement from "@/pages/User/UserManagement";
import CompanyManagement from "@/pages/Company/CompanyManagement";
import RolesAndAccess from "@/pages/RolesAndAccess/RolesAndAccess";

import { AddNewUser } from "@/components/users/AddNewUser";
import AddNewCompany from "@/pages/Company/AddNewCompany";
import { RoleForm } from "@/pages/RolesAndAccess/RoleForm";

import Simulation from "@/pages/Simulation/Simulation";
import AddSimulation from "@/pages/Simulation/AddSimulation/AddSimulation";

import Packages from "@/pages/Packages/Packages";
import { AddNewPackage } from "@/pages/Packages/AddNewPackage";
import { ViewPackage } from "@/pages/Packages/ViewPackage";
import DataScience from "@/pages/Packages/DataScience";

import Plans from "@/pages/Packages/plans";

import { Invitations } from "@/components/Invitations/Invitations";
import Payments from "@/pages/Payments/Payments";
import UserAssignment from "@/pages/UserAssignment/UserAssignment";
import Profile from "@/components/Profile/Profile";

import ViewSkillMatrix from "@/pages/SkillMatrix/ViewSkillMatrix/ViewSkillMatrix";
import SkillMatrix from "@/pages/SkillMatrix/SkillMatrix";
import SkillMatrixView from "@/pages/SkillMatrix/SkillMatrixView";
import Score from "@/pages/SkillMatrix/ViewSkillMatrix/Score";

import UserDetails from "@/pages/UserDetails/UserDetails";
import { UserDashboard } from "@/pages/UserDashboard/UserDashboard";
import CaseStudyDetail from "@/components/user dashboard/CaseStudyDetail";
import UserPreferences from "@/pages/UserPreferences/UserPreferences";
import InnerPage from "@/pages/InnerPage/InnerPage";

// Route definitions
const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Index />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/user-role-&-access",
    element: (
      <PrivateRoute>
        <RolesAndAccess />
      </PrivateRoute>
    ),
  },
  {
    path: "/user-role-&-access/:UserGroupId",
    element: (
      <PrivateRoute>
        <UserGroupDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <PrivateRoute>
        <UserManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/company",
    element: (
      <PrivateRoute>
        <Outlet />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <CompanyManagement />
          </PrivateRoute>
        ),
      },
      {
        path: "add-company",
        element: (
          <PrivateRoute>
            <AddNewCompany />
          </PrivateRoute>
        ),
      },
      {
        path: ":companyId",
        element: (
          <PrivateRoute>
            <AddNewCompany />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/simulation",
    element: (
      <PrivateRoute>
        <Outlet />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Simulation />
          </PrivateRoute>
        ),
      },
      {
        path: "new-simulation",
        element: (
          <PrivateRoute>
            <AddSimulation />
          </PrivateRoute>
        ),
      },
      {
        path: ":simulationId",
        element: (
          <PrivateRoute>
            <AddSimulation />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/packages",
    element: (
      <PrivateRoute>
        <Packages />
      </PrivateRoute>
    ),
  },
  {
    path: "/add-new-package",
    element: (
      <PrivateRoute>
        <AddNewPackage />
      </PrivateRoute>
    ),
  },
  {
    path: "/package/:id",
    element: (
      <PrivateRoute>
        <ViewPackage />
      </PrivateRoute>
    ),
  },
  {
    path: "/datascience",
    element: (
      <PrivateRoute>
        <DataScience />
      </PrivateRoute>
    ),
  },
  {
    path: "/user-assignment",
    element: (
      <PrivateRoute>
        <UserAssignment />
      </PrivateRoute>
    ),
  },
  {
    path: "/add-new-user",
    element: (
      <PrivateRoute>
        <AddNewUser />
      </PrivateRoute>
    ),
  },
  // {
  //   path: "/add-role",
  //   element: (
  //     <PrivateRoute>
  //       <RoleForm />
  //     </PrivateRoute>
  //   ),
  // },
  {
    path: "/plan",
    element: (
      <PrivateRoute>
        <Plans />
      </PrivateRoute>
    ),
  },
  {
    path: "/payments",
    element: (
      <PrivateRoute>
        <Payments />
      </PrivateRoute>
    ),
  },
  {
    path: "/skill-matrix",
    element: (
      <PrivateRoute>
        <SkillMatrix />
      </PrivateRoute>
    ),
  },
  {
    path: "/view-skill-matrix",
    element: (
      <PrivateRoute>
        <ViewSkillMatrix />
      </PrivateRoute>
    ),
  },
  {
    path: "/skill-matrix-view",
    element: (
      <PrivateRoute>
        <SkillMatrixView />
      </PrivateRoute>
    ),
  },
  {
    path: "/score",
    element: (
      <PrivateRoute>
        <Score />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/invitations",
    element: (
      <PrivateRoute>
        <Invitations />
      </PrivateRoute>
    ),
  },
  {
    path: "/user-details/:id",
    element: (
      <PrivateRoute>
        <UserDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/user-dashboard",
    element: (
      <PrivateRoute>
        <UserDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/case-study-detail",
    element: (
      <PrivateRoute>
        <CaseStudyDetail />
      </PrivateRoute>
    ),
  },
  {
    path: "/preferences",
    element: (
      <PrivateRoute>
        <UserPreferences />
      </PrivateRoute>
    ),
  },
  {
    path: "/inner-page",
    element: (
      <PrivateRoute>
        <InnerPage />
      </PrivateRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
