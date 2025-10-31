import {NgModule} from "@angular/core";
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./gurads/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    loadChildren: () => import("./pages/login/login.module").then(m => m.LoginPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "tabs",
    loadChildren: () => import("./tabs/tabs.module").then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "details",
    loadChildren: () => import("./pages/plannings/details/details.module").then(m => m.DetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "update",
    loadChildren: () => import("./pages/profil/update/update.module").then(m => m.UpdatePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "update-profile",
    loadChildren: () => import("./widgets/modals/update-profile/update-profile.module").then(m => m.UpdateProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "documents",
    loadChildren: () => import("./pages/profil/documents/documents.module").then(m => m.DocumentsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "vehicles",
    loadChildren: () => import("./pages/profil/vehicles/vehicles.module").then(m => m.VehiclesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "documents-modal",
    loadChildren: () => import("./widgets/modals/documents-modal/documents-modal.module").then(m => m.DocumentsModalPageModule)
  },
  {
    path: "make-request",
    loadChildren: () => import("./widgets/modals/make-request/make-request.module").then(m => m.MakeRequestPageModule)
  },
  {
    path: "absence-request",
    loadChildren: () => import("./pages/absences/absence-request/absence-request.module").then(m => m.AbsenceRequestPageModule)
  },
  {
    path: "request-processed",
    loadChildren: () => import("./pages/absences/request-processed/request-processed.module").then(m => m.RequestProcessedPageModule)
  },
  {
    path: "absence-details",
    loadChildren: () => import("./widgets/modals/absence-details/absence-details.module").then(m => m.AbsenceDetailsPageModule)
  },
  {
    path: "material-request-processed",
    loadChildren: () => import("./pages/materials/request-processed/request-processed.module").then(m => m.RequestProcessedPageModule)
  },
  {
    path: "material-request",
    loadChildren: () => import("./pages/materials/material-request/material-request.module").then(m => m.MaterialRequestPageModule)
  },
  {
    path: "info-box-material",
    loadChildren: () => import("./widgets/modals/info-box-material/info-box-material.module").then(m => m.InfoBoxMaterialPageModule)
  },
  {
    path: "material-request",
    loadChildren: () => import("./widgets/modals/material-request/material-request.module").then(m => m.MaterialRequestPageModule)
  },
  {
    path: "materials-agent",
    loadChildren: () => import("./widgets/modals/materials-agent/materials-agent.module").then(m => m.MaterialsAgentPageModule)
  },
  {
    path: "absence-supervisor",
    loadChildren: () => import("./pages/absences/absence-supervisor/absence-supervisor.module").then(m => m.AbsenceSupervisorPageModule)
  },
  {
    path: "materials-requests-supervisor",
    loadChildren: () => import("./pages/materials/materials-requests-supervisor/materials-requests-supervisor.module").then(m => m.MaterialsRequestsSupervisorPageModule)
  },
  {
    path: "mission-returns",
    loadChildren: () => import("./widgets/modals/mission-returns/mission-returns.module").then(m => m.MissionReturnsPageModule)
  },
  {
    path: "change-vehicle",
    loadChildren: () => import("./pages/missions/agents/change-vehicle/change-vehicle.module").then(m => m.ChangeVehiclePageModule)
  },
  {
    path: "unsuitable-vehicle",
    loadChildren: () => import("./widgets/modals/missions/agents/unsuitable-vehicle/unsuitable-vehicle.module").then(m => m.UnsuitableVehiclePageModule)
  },
  {
    path: "non-rolling-vehicle",
    loadChildren: () => import("./widgets/modals/missions/agents/non-rolling-vehicle/non-rolling-vehicle.module").then(m => m.NonRollingVehiclePageModule)
  },
  {
    path: "report-defect",
    loadChildren: () => import("./widgets/modals/missions/agents/report-defect/report-defect.module").then(m => m.ReportDefectPageModule)
  },
  {
    path: "vehicle-allocation",
    loadChildren: () => import("./widgets/modals/missions/agents/vehicle-allocation/vehicle-allocation.module").then(m => m.VehicleAllocationPageModule)
  },
  {
    path: "vehicle-confirmation",
    loadChildren: () => import("./widgets/modals/missions/agents/vehicle-confirmation/vehicle-confirmation.module").then(m => m.VehicleConfirmationPageModule)
  },
  {
    path: "get-vehicule",
    loadChildren: () => import("./widgets/modals/missions/agents/get-vehicule/get-vehicule.module").then(m => m.GetVehiculePageModule)
  },
  {
    path: "not-around-ideo",
    loadChildren: () => import("./widgets/modals/missions/agents/not-around-ideo/not-around-ideo.module").then(m => m.NotAroundIdeoPageModule)
  },
  {
    path: "photo-report",
    loadChildren: () => import("./pages/missions/agents/photo-report/photo-report.module").then(m => m.PhotoReportPageModule)
  },
  {
    path: "pointage",
    loadChildren: () => import("./pages/pointage/agent/pointage/pointage.module").then(m => m.PointagePageModule)
  },
  {
    path: "agent-absence",
    loadChildren: () => import("./pages/absences/agent-absence/agent-absence.module").then(m => m.AgentAbsencePageModule)
  },
  {
    path: "agent-material",
    loadChildren: () => import("./pages/materials/agent-material/agent-material.module").then(m => m.AgentMaterialPageModule)
  },
  {
    path: "missions",
    loadChildren: () => import("./pages/missions/supervisor/missions/missions.module").then(m => m.MissionsPageModule)
  },
  {
    path: "mission-details",
    loadChildren: () => import("./pages/missions/supervisor/mission-details/mission-details.module").then(m => m.MissionDetailsPageModule)
  },
  {
    path: "menu-mession",
    loadChildren: () => import("./pages/missions/supervisor/menu-mession/menu-mession.module").then(m => m.MenuMessionPageModule)
  },
  {
    path: "reports-photos",
    loadChildren: () => import("./pages/missions/supervisor/reports-photos/reports-photos.module").then(m => m.ReportsPhotosPageModule)
  },
  {
    path: "supervisor-plannings",
    loadChildren: () => import("./pages/missions/supervisor/supervisor-plannings/supervisor-plannings.module").then(m => m.SupervisorPlanningsPageModule)
  },
  {
    path: "send-report",
    loadChildren: () => import("./pages/missions/supervisor/send-report/send-report.module").then(m => m.SendReportPageModule)
  },
  {
    path: "share-report",
    loadChildren: () => import("./pages/missions/supervisor/share-report/share-report.module").then(m => m.ShareReportPageModule)
  },
  {
    path: "regular-per-agent",
    loadChildren: () => import("./pages/missions/supervisor/regular-per-agent/regular-per-agent.module").then(m => m.RegularPerAgentPageModule)
  },
  {
    path: "pointages",
    loadChildren: () => import("./pages/missions/supervisor/pointages/pointages.module").then(m => m.PointagesPageModule)
  },
  {
    path: "mission-returns-supervisor",
    loadChildren: () => import("./widgets/modals/mission-returns-supervisor/mission-returns-supervisor.module").then(m => m.MissionReturnsSupervisorPageModule)
  },
  {
    path: "documents-supervisor",
    loadChildren: () => import("./pages/missions/supervisor/documents/documents.module").then(m => m.DocumentsPageModule)
  },
  {
    path: "visit-user-documents",
    loadChildren: () => import("./pages/missions/supervisor/visit-user-documents/visit-user-documents.module").then(m => m.VisitUserDocumentsPageModule)
  },
  {
    path: "vehicules",
    loadChildren: () => import("./pages/missions/supervisor/vehicules/vehicules.module").then(m => m.VehiculesPageModule)
  },
  {
    path: "vehicle-driving/:id/:name/:image",
    loadChildren: () => import("./pages/missions/supervisor/vehicle-driving/vehicle-driving.module").then(m => m.VehicleDrivingPageModule)
  },
  {
    path: "vehicle-driving-details",
    loadChildren: () => import("./pages/missions/supervisor/vehicle-driving-details/vehicle-driving-details.module").then(m => m.VehicleDrivingDetailsPageModule)
  },
  {
    path: "return-recurring-mission",
    loadChildren: () => import("./pages/missions/supervisor/return-recurring-mission/return-recurring-mission.module").then(m => m.ReturnRecurringMissionPageModule)
  },
  {
    path: "return-recurring-mission-agent",
    loadChildren: () => import("./pages/missions/agents/return-recurring-mission-agent/return-recurring-mission-agent.module").then(m => m.ReturnRecurringMissionAgentPageModule)
  },
  {
    path: "return-recurring-mission-agent-modal",
    loadChildren: () =>
      import("./widgets/modals/missions/agents/return-recurring-mission-agent-modal/return-recurring-mission-agent-modal.module").then(
        m => m.ReturnRecurringMissionAgentModalPageModule
      )
  },
  {
    path: "placement-of-agents",
    loadChildren: () => import("./pages/missions/supervisor/placement-of-agents/placement-of-agents.module").then(m => m.PlacementOfAgentsPageModule)
  },
  {
    path: "placement-of-agents-details",
    loadChildren: () => import("./pages/missions/supervisor/placement-of-agents-details/placement-of-agents-details.module").then(m => m.PlacementOfAgentsDetailsPageModule)
  },
  {
    path: "placement-of-agents-affect",
    loadChildren: () => import("./pages/missions/supervisor/placement-of-agents-affect/placement-of-agents-affect.module").then(m => m.PlacementOfAgentsAffectPageModule)
  },
  {
    path: "placement-of-agents-confirm-modal",
    loadChildren: () =>
      import("./widgets/modals/missions/supervisor/placement-of-agents-confirm-modal/placement-of-agents-confirm-modal.module").then(m => m.PlacementOfAgentsConfirmModalPageModule)
  },
  {
    path: "gdc",
    loadChildren: () => import("./widgets/modals/gdc/gdc.module").then(m => m.GdcPageModule)
  },
  {
    path: "see-vehicule-by-planning",
    loadChildren: () => import("./pages/missions/supervisor/see-vehicule-by-planning/see-vehicule-by-planning.module").then(m => m.SeeVehiculeByPlanningPageModule)
  },
  {
    path: "agent-tracking",
    loadChildren: () => import("./pages/missions/supervisor/agent-tracking/agent-tracking.module").then(m => m.AgentTrackingPageModule)
  },
  {
    path: "chat-room",
    loadChildren: () => import("./pages/chat/chat-room/chat-room.module").then(m => m.ChatRoomPageModule)
  },
  {
    path: "ticket-management",
    loadChildren: () => import("./pages/tickets/ticket-management/ticket-management.module").then(m => m.TicketManagementPageModule)
  },
  {
    path: "task-list",
    loadChildren: () => import("./pages/tickets/task-list/task-list.module").then(m => m.TaskListPageModule)
  },
  {
    path: "archive-list",
    loadChildren: () => import("./pages/tickets/archive-list/archive-list.module").then(m => m.ArchiveListPageModule)
  },
  {
    path: "add-ticket",
    loadChildren: () => import("./pages/tickets/add-ticket/add-ticket.module").then(m => m.AddTicketPageModule)
  },
  {
    path: 'ocr-scanner',
    loadChildren: () => import('./pages/ocr-scanner/ocr-scanner.module').then( m => m.OcrScannerPageModule)
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
