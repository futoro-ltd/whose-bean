import { redirect } from 'next/navigation';
import { checkUsersExist } from '@/app/actions/auth';

export default async function Home() {
  const { hasUsers } = await checkUsersExist();
  redirect(hasUsers ? '/login' : '/register');
}
