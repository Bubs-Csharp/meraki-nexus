import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OwnerCommunications = () => {
  const { profile } = useAuth();

  const { data: communications } = useQuery({
    queryKey: ["owner-communications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("communications")
        .select("*, properties(name)")
        .or(`sender_id.eq.${profile?.id},recipient_id.eq.${profile?.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const unreadCount = communications?.filter(c => 
    c.recipient_id === profile?.id && !c.is_read
  ).length || 0;

  const sentMessages = communications?.filter(c => c.sender_id === profile?.id) || [];
  const receivedMessages = communications?.filter(c => c.recipient_id === profile?.id) || [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Communications</h1>
          <p className="text-muted-foreground">Messages and notifications</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{communications?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sentMessages.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Message Center</CardTitle>
                <CardDescription>View and manage your communications</CardDescription>
              </div>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received">
              <TabsList>
                <TabsTrigger value="received">
                  Received {unreadCount > 0 && <Badge className="ml-2">{unreadCount}</Badge>}
                </TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
              </TabsList>

              <TabsContent value="received" className="space-y-4 mt-6">
                {receivedMessages.length > 0 ? (
                  receivedMessages.map((message) => (
                    <Card key={message.id} className={!message.is_read ? "border-primary" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <CardTitle className="text-base">{message.subject}</CardTitle>
                              {!message.is_read && <Badge variant="default">New</Badge>}
                            </div>
                            <CardDescription className="mt-1">
                              {message.properties?.name} • {new Date(message.created_at).toLocaleString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{message.message}</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Reply
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No messages received</p>
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-4 mt-6">
                {sentMessages.length > 0 ? (
                  sentMessages.map((message) => (
                    <Card key={message.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              <CardTitle className="text-base">{message.subject}</CardTitle>
                            </div>
                            <CardDescription className="mt-1">
                              {message.properties?.name} • {new Date(message.created_at).toLocaleString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{message.message}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No sent messages</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OwnerCommunications;