export interface Vehicle {
  id: number;
  name: string;
  type_material: string;
  photo: {
    url: string;
    thumb: {
      url: string;
    };
  };
  notes: string;
  serial_number: string | null;
  driver_id: number;
  grey_card: {
    url: string | null;
  };
  insurance: {
    url: string | null;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
  uniq: boolean;
  address_recup: string | null;
  lat: number | null;
  long: number | null;
}

export interface PointingInternal {
  id: number;
  user_id: number;
  intervention_id: number;
  date: string;
  planning_punctual_agent_id: number;
  planning_regular_agent_id: number | null;
  lat: number | null;
  long: number | null;
  created_at: string;
  updated_at: string;
  extra_hours: string | null;
  lat_2: number | null;
  long_2: number | null;
  hour_start: string | null;
  hour_end: string | null;
  pointage_valide: boolean;
  panier_repas: string;
  heure_travail: string | null;
  admin_user_id: number | null;
  forfaitaire_agent_id: number | null;
}

export interface VehiculeReturn {
  id: number;
  planning_punctual_id: number;
  forfaitaire_item_id: number | null;
  user_id: number;
  photo: string[];
  date: string;
  material_id: number;
  created_at: string;
  updated_at: string;
  initial_material_id: number;
  is_changed: boolean;
  return_raison: string;
  hour_start: string;
  hour_end: string;
  broken_place_lat: number | null;
  broken_place_long: number | null;
  file: string[];
}

export interface TeamMember {
  id: number;
  planning_punctual_agent_id: number;
  first_name: string;
  last_name: string;
  is_extern: boolean;
  is_driver: boolean;
  hour_start: string;
  hour_end: string;
  role: string;
  absent: boolean;
  phone: string;
  first_pointing_internal: PointingInternal[] | null;
  second_pointing_internal: PointingInternal[] | null;
  intervention_id: number;
  vehicule: Vehicle;
  vehicule_returns: VehiculeReturn[];
}

export interface Intervention {
  id: number;
  date: string;
  intervention_name: string;
  address: string;
  logo: {
    url: string;
    thumb: {
      url: string;
    };
  };
  hour_start: any;
  hour_end: any;
  prestation: string;
  mission: string;
  remark: string;
  info_photos: any[];
  contacts: any[];
  team: TeamMember[];
  teamleader: TeamMember[];
  subcontractors_selected_agents: any[];
  mission_return: any | null;
  pointing: any | null;
  long: string;
  lat: string;
  mattermost_channel_id: string;
  showDetails: boolean;
  has_info_photo: boolean;
}

export interface PlanningData {
  today_planning_punctuals: Intervention[];
  today_planning_regulars: Intervention[];
  today_planning_forfaitaires: Intervention[];
}
