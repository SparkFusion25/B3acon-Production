import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  // Redirect root URL to main software login
  return redirect("/login");
};

// This component should never render due to the redirect
export default function Index() {
  return null;
}