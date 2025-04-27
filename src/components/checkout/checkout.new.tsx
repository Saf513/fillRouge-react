import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
// import Image from "react-image-enhancer";

// Icônes - gardez la même importation depuis lucide-react
import {
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Check,
  Shield,
  Lock,
  Info,
  X,
  Calendar,
  User,
  MapPin,
  ShoppingCart,
  CheckCircle2,
  Loader2,
  Download,
  ArrowRight,
  Mail,
  Clock,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; 