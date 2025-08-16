interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

export interface Customer {
  id: number | string;
  first_name: string;
  last_name: string;
  phone_code: string;
  phone_number: string;
  email: string;
  street: string;
  city: string;
  zip_code: string;
  state: string;
  country: string;
  created_by: User;
  created_at: string;
  updated_at: string;
}
