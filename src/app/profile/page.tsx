"use client";
import React, { useState } from "react";
import Breadcrumb from "@/components/ComponentHeader/ComponentHeader";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CameraIcon, EditIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon, CalendarIcon, StarIcon, TrophyIcon, ActivityIcon, SaveIcon, XIcon } from "lucide-react";
import { useUser } from "../context/UserContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const Profile = () => {
  const user = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    userBio: user.userBio || "",
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        userBio: user.userBio || "",
      });
    }
  };

  const handleSave = () => {
    // Here you would typically save the user data via API
    console.log("Saving user data:", editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      userBio: user.userBio || "",
    });
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <Breadcrumb pageName="Profile" containActionButton={false} />

        {/* Profile Header Card */}
        <Card variant="elevated" className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10" />
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-repeat bg-[length:60px_60px]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          
          <div className="relative z-10">
            {/* Cover Area */}
            <div className="h-32 md:h-48 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:300%_100%] animate-gradient-shift" />
            
            {/* Profile Content */}
            <div className="px-6 pb-8">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-8">
                {/* Profile Image */}
                <div className="relative -mt-16 md:-mt-20">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-2 shadow-xl">
                    <Image
                      src={user.photo || "/images/user/user-01.png"}
                      width={160}
                      height={160}
                      className="w-full h-full rounded-full object-cover"
                      alt="profile"
                    />
                    <label
                      htmlFor="profile"
                      className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110"
                    >
                      <CameraIcon size={20} />
                      <input
                        type="file"
                        name="profile"
                        id="profile"
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 mt-4 md:mt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="text-lg text-primary font-medium mb-2">Drug Researcher</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <MapPinIcon size={16} className="mr-1" />
                          San Francisco, CA
                        </span>
                        <span className="flex items-center">
                          <CalendarIcon size={16} className="mr-1" />
                          Joined March 2024
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Button
                        variant={isEditing ? "outline" : "primary"}
                        onClick={handleEditToggle}
                        className="flex items-center space-x-2"
                      >
                        <EditIcon size={16} />
                        <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="gradient" className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-full mx-auto mb-4">
              <TrophyIcon size={24} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-1">259</h3>
            <p className="text-gray-600 dark:text-gray-400">Research Contributions</p>
          </Card>
          
          <Card variant="gradient" className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-full mx-auto mb-4">
              <StarIcon size={24} className="text-secondary" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-1">42</h3>
            <p className="text-gray-600 dark:text-gray-400">Published Papers</p>
          </Card>
          
          <Card variant="gradient" className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-4">
              <ActivityIcon size={24} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-1">89%</h3>
            <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-white">Personal Information</h2>
              {isEditing && (
                <div className="flex space-x-2">
                  <Button variant="success" size="sm" onClick={handleSave}>
                    <SaveIcon size={16} className="mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <XIcon size={16} className="mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={editedUser.firstName}
                      onChange={(e) => setEditedUser({...editedUser, firstName: e.target.value})}
                      leftIcon={<UserIcon size={16} />}
                    />
                    <Input
                      label="Last Name"
                      value={editedUser.lastName}
                      onChange={(e) => setEditedUser({...editedUser, lastName: e.target.value})}
                      leftIcon={<UserIcon size={16} />}
                    />
                  </div>
                  <Input
                    label="Email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    leftIcon={<MailIcon size={16} />}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                    leftIcon={<PhoneIcon size={16} />}
                  />
                  <Input
                    label="Location"
                    value={editedUser.location}
                    onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                    leftIcon={<MapPinIcon size={16} />}
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <UserIcon size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-medium text-black dark:text-white">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MailIcon size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-medium text-black dark:text-white">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <PhoneIcon size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-black dark:text-white">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MapPinIcon size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium text-black dark:text-white">San Francisco, CA</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* About Section */}
          <Card>
            <h2 className="text-xl font-semibold text-black dark:text-white mb-6">About Me</h2>
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  Bio
                </label>
                <textarea
                  value={editedUser.userBio}
                  onChange={(e) => setEditedUser({...editedUser, userBio: e.target.value})}
                  className="w-full p-3 border border-stroke dark:border-strokedark rounded-lg bg-white dark:bg-form-input text-black dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                  rows={6}
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {user.userBio || "Passionate drug researcher with expertise in molecular biology and computational chemistry. Focused on developing innovative therapeutic solutions for complex diseases."}
                </p>
                
                <div className="border-t border-stroke dark:border-strokedark pt-4">
                  <h3 className="font-semibold text-black dark:text-white mb-3">Research Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Drug Discovery", "Molecular Biology", "Computational Chemistry", "Pharmacokinetics", "Toxicology"].map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
