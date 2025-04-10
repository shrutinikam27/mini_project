import { Button } from "components/ui/button";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Image src="/logo1.png" alt="Logo" width={40} height={40} />
          <span className="text-2xl font-extrabold text-pink-500">Era</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm">
            Privacy Policy
          </Button>
          <Button variant="ghost" size="sm">
            Terms of Service
          </Button>
        </div>
      </div>
    </footer>
  );
};
