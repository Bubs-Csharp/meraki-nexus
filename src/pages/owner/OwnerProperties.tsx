import RoleBasedLayout from "@/components/RoleBasedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const OwnerProperties = () => {
  return (
    <RoleBasedLayout allowedRoles={["property_owner"]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Properties</h1>
            <p className="text-muted-foreground">Manage your property portfolio</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Properties List</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No properties yet. Add your first property to get started.</p>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
};

export default OwnerProperties;
