"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/sidebar";
import { 
  Users, 
  Search,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  Star,
  Briefcase
} from "lucide-react";

interface Contact {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  priority?: string;
}

export default function PipelinePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Demo data - will connect to Notion/Firebase later
    setTimeout(() => {
      setContacts([
        { name: "Jasmine Johnson", email: "jasmine.johnson@us.af.mil", company: "MCCS Okinawa", title: "Training & Curriculum Specialist", priority: "high" },
        { name: "Nick McQuillin", email: "nick.mcquillin@ocsi.mil", company: "OCSI", title: "Operations Director", priority: "high" },
        { name: "Eric Bable", email: "eric.bable@deca.mil", company: "DeCA Pacific", title: "Contract Specialist", priority: "high" },
        { name: "Samantha Silva", email: "samantha.silva@us.af.mil", company: "PACAF 18 FSS", title: "Youth Programs", priority: "medium" },
        { name: "Robert E. Armel Jr.", email: "robert.armel@deca.mil", company: "DeCA", title: "Overseas Product Specialist", priority: "medium" },
        { name: "Theresa Schad", email: "theresa.schad@us.af.mil", company: "PACAF 18 FSS", title: "Youth Programs", priority: "medium" },
      ]);
      setLoading(false);
    }, 100);
  }, []);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const priorityColors: Record<string, string> = {
    high: "bg-red-500/10 text-red-400 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Pipeline</h1>
            <p className="text-zinc-500 mt-1">Contacts and leads. The blood of this operation.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">{contacts.length} contacts</span>
            <button 
              onClick={() => setLoading(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>

        {/* Priority Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">High Priority</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">{contacts.filter(c => c.priority === 'high').length}</p>
          </div>
          <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">Medium Priority</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">{contacts.filter(c => c.priority === 'medium').length}</p>
          </div>
          <div className="border border-zinc-800 bg-zinc-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">Total</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">{contacts.length}</p>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 text-zinc-500 animate-spin" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Users className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No contacts found</p>
            </div>
          ) : (
            filteredContacts.map((contact, i) => (
              <div 
                key={i}
                className={`border rounded-lg p-4 ${priorityColors[contact.priority || 'low']}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-medium">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{contact.name}</p>
                      <p className="text-sm text-zinc-500">{contact.title}</p>
                    </div>
                  </div>
                  {contact.priority === 'high' && (
                    <Star className="h-4 w-4 text-red-400 fill-current" />
                  )}
                </div>
                
                <div className="mt-3 space-y-1">
                  {contact.company && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Building2 className="h-3 w-3" />
                      <span>{contact.company}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Mail className="h-3 w-3" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
