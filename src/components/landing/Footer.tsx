import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="py-16 relative overflow-hidden border-t border-border">
      <div className="container relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">EstateFlow</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              A polished real-estate CRM UI kit for dealers and agencies.
              Explore the demo dashboard with local dummy data — no backend required.
            </p>
            <div className="flex gap-4">
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-primary/50">
                  Open Demo
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Try Dashboard</Button>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">
                  Live Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@estateflow.app</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 22 4000 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EstateFlow. UI demo for marketplace buyers.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>LocalStorage demo mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
