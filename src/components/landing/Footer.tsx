import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="py-16 relative overflow-hidden border-t border-border">
      <div className="container relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">ApnaCodex</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              India's #1 AI-powered Real Estate CRM. Never lose a WhatsApp lead again. 
              Close 2X more deals with 24/7 automation.
            </p>
            <div className="flex gap-4">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-primary/50">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">Dashboard</Link>
              </li>
              <li>
                <a href="https://apnacodex.com" target="_blank" rel="noopener" className="hover:text-primary transition-colors flex items-center gap-1">
                  Live App <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>demo@apnacodex.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 ApnaCodex. Made with ❤️ for Indian Real Estate
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>99.9% Uptime</span>
            <span className="mx-2">•</span>
            <span>Bank-level Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;