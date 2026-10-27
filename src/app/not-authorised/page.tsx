import Link from "next/link";

export default function NotAuthorisedPage() {
  return <main className="authPage"><section className="authCard"><p className="eyebrow">AthleteOS Training</p><h1>Not authorised</h1><p>This account does not have access to the admin dashboard.</p><Link className="buttonLink" href="/sign-in">Return to sign in</Link></section></main>;
}
