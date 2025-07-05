"use client";
import Breadcrumb from "@/components/ComponentHeader/ComponentHeader";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import DarkModeSwitcher from "@/components/Header/DarkModeSwitcher";
import { Edit, MailIcon, CameraIcon, User, Settings as SettingsIcon, Shield, Bell, Palette, Save, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { getUserByEmail, updateUser } from "@/lib/actions/user.actions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";

const Settings = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userBio: "",
    photo: "",
    id: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        const user = await getUserByEmail(session.user.email);
        setUserData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userBio: user.userBio || "",
          photo: user.photo || "/images/user/user-03.png",
          id: user._id,
        });
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  const handlePersonalInfoSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        userBio: userData.userBio,
        photo: userData.photo,
        email: userData.email,
      };

      if (userData.id) {
        const updated = await updateUser(userData.id, updatedUser);
        setUserData(updated);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors("Failed to update profile.");
      console.error("Error updating user:", error);
    }
  };

  const handleImageUploadSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let base64Image = userData.photo;
      if (imageFile) {
        base64Image = await convertImageToBase64(imageFile);
      }

      if (userData.id) {
        const updatedUser = {
          ...userData,
          photo: base64Image,
        };
        const updated = await updateUser(userData.id, updatedUser);
        setUserData(updated);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors("Failed to upload image.");
      console.error("Error uploading image:", error);
    }
  };

  const convertImageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setUserData((prevData) => ({
        ...prevData,
        photo: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <Breadcrumb pageName="Settings" />
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <Card className="p-1">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <>
              <div className="lg:col-span-2">
                <AnimatedContainer>
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">
                      Personal Information
                    </h3>
                    
                    {errors && (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-700 dark:text-red-400">{errors}</p>
                      </div>
                    )}

                    <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="First Name"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleChange}
                          leftIcon={<User className="w-5 h-5" />}
                          required
                        />
                        <Input
                          label="Last Name"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleChange}
                          leftIcon={<User className="w-5 h-5" />}
                          required
                        />
                      </div>

                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={userData.email}
                        leftIcon={<MailIcon className="w-5 h-5" />}
                        readOnly
                        helperText="Email cannot be changed"
                      />

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Bio
                        </label>
                        <div className="relative">
                          <Edit className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                          <textarea
                            name="userBio"
                            rows={4}
                            value={userData.userBio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            className="w-full pl-10 pr-4 py-3 border border-stroke dark:border-form-strokedark rounded-lg bg-white dark:bg-form-input text-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button variant="outline" type="button">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Card>
                </AnimatedContainer>
              </div>

              <div className="lg:col-span-1">
                <AnimatedContainer delay={0.1}>
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6">
                      Profile Photo
                    </h3>

                    <div className="text-center mb-6">
                      <div className="relative inline-block">
                        <Image
                          src={userData.photo}
                          width={120}
                          height={120}
                          alt="User"
                          className="rounded-full border-4 border-primary/20"
                        />
                        <button
                          onClick={() => document.getElementById("fileInput")?.click()}
                          className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                        >
                          <CameraIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Click to update your photo
                      </p>
                    </div>

                    <form onSubmit={handleImageUploadSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="fileInput"
                        />
                        <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                          <CameraIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Drop your image here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            SVG, PNG, JPG or GIF (max 800x800px)
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          type="button"
                          onClick={() => setImageFile(null)}
                          className="flex-1"
                        >
                          Reset
                        </Button>
                        <Button 
                          size="sm" 
                          type="submit" 
                          disabled={isLoading}
                          className="flex-1"
                        >
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </form>
                  </Card>
                </AnimatedContainer>
              </div>
            </>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="lg:col-span-3">
              <AnimatedContainer>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Appearance Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">Dark Mode</h4>
                        <p className="text-sm text-muted-foreground">
                          Switch between light and dark themes
                        </p>
                      </div>
                      <DarkModeSwitcher />
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-medium text-foreground mb-3">Color Scheme</h4>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { name: "Blue", color: "bg-blue-500" },
                          { name: "Purple", color: "bg-purple-500" },
                          { name: "Green", color: "bg-green-500" },
                          { name: "Orange", color: "bg-orange-500" },
                        ].map((scheme) => (
                          <button
                            key={scheme.name}
                            className="p-3 rounded-lg border border-stroke hover:border-primary transition-colors"
                          >
                            <div className={`w-full h-8 rounded ${scheme.color} mb-2`} />
                            <p className="text-sm text-foreground">{scheme.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </AnimatedContainer>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="lg:col-span-3">
              <AnimatedContainer>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Notification Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { label: "Email Notifications", desc: "Receive email updates about your account" },
                      { label: "Push Notifications", desc: "Get push notifications on your devices" },
                      { label: "Research Updates", desc: "Updates about new compounds and research" },
                      { label: "Chat Messages", desc: "Notifications for new chat messages" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-stroke rounded-lg">
                        <div>
                          <h4 className="font-medium text-foreground">{item.label}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-primary rounded focus:ring-primary"
                          defaultChecked
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedContainer>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="lg:col-span-3">
              <AnimatedContainer>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    Security Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-amber-700 dark:text-amber-400">
                        Security settings are managed through your authentication provider.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Active Sessions
                      </Button>
                    </div>
                  </div>
                </Card>
              </AnimatedContainer>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
