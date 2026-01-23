export interface Photo {
  url: string;
  thumb?: {url: string};
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job: string;
  role: string;
  active: boolean;
  address: string;
  is_driver: boolean;
  is_teamleader: boolean;
  current_position_lat: number;
  current_position_long: number;
  last_sign_in_at: string;
  current_sign_in_at: string;
  photo: Photo;
  photo_urls: any;
  password: string;
  rib: any;
  cin: any;
  btp: any;
  driving_license: any;
  vehicle_insurance: any;
  mutuelle: any;
  social_security: any;
  proof_address: any;
  gray_card: any;
}

export interface AuthResponse {
  user: User;
  token: string;
}
