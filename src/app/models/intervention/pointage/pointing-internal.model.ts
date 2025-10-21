import {User} from "../../auth/user";

export class Pointing_Internal {
  id?: number;
  planning_type?: string;
  planning_punctual_id?: number;
  planning_regular_id?: number;
  forfaitaire_item_id?: number;
  intervention_id?: number;
  date?: Date;
  user_id?: number;
  lat?: any;
  long?: any;
  user?: User;
  lat_2?: any;
  long_2?: any;
  hour_start?: string;
  hour_end?: string;
}
