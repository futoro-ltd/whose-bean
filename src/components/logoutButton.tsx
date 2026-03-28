import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/app/actions/auth';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };
  return (
    <Button variant="outline" className="gap-1" onClick={handleLogout}>
      <LogOut />
      <span className="md:flex hidden">Logout</span>
    </Button>
  );
}
