import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Checkbox } from './ui/Checkbox';
import { Camera, MapPin, Bell, Users, Info, Check } from 'lucide-react';
import permissionsData from '../data/permissions.json';

interface PermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPermissionsSet: (permissions: Record<string, boolean>) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Camera,
  MapPin,
  Bell,
  Users
};

export function PermissionsModal({ open, onOpenChange, onPermissionsSet }: PermissionsModalProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions(prev => ({ ...prev, [permissionId]: checked }));
  };

  const handleContinue = () => {
    onPermissionsSet(permissions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Info className="h-6 w-6 text-blue-600" />
            App Permissions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Your privacy matters.</strong> All permissions are optional and you can always use manual alternatives. 
              We only use permissions for the features you choose to enable.
            </p>
          </div>

          <div className="space-y-4">
            {permissionsData.map((permission) => {
              const IconComponent = iconMap[permission.icon];
              return (
                <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        id={permission.id}
                        checked={permissions[permission.id] || false}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                          <h3 className="font-medium text-black">{permission.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{permission.purpose}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Used for:</p>
                            <div className="flex flex-wrap gap-1">
                              {permission.usage.map((use, index) => (
                                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {use}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-1">Alternatives:</p>
                            <div className="flex flex-wrap gap-1">
                              {permission.alternatives.map((alt, index) => (
                                <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                  {alt}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {Object.values(permissions).filter(Boolean).length} of {permissionsData.length} permissions enabled
            </div>
            
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Continue with Settings
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}