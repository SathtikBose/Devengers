import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import * as Updates from "expo-updates";
import { Feather } from "@expo/vector-icons";

/**
 * 🚀 UpdateHandler
 * Monitors EAS Updates and provides a premium UI for users to update the app.
 */
export const UpdateHandler = () => {
  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Automatically show modal when an update is available
  useEffect(() => {
    if (isUpdateAvailable) {
      setShowModal(true);
    }
  }, [isUpdateAvailable]);

  // Automatically reload when update is fully downloaded
  useEffect(() => {
    if (isUpdatePending) {
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await Updates.fetchUpdateAsync();
    } catch (error) {
      console.error("❌ Update download failed:", error);
      setIsDownloading(false);
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <Modal transparent visible={showModal} animationType="fade">
      <View className="flex-1 bg-black/60 items-center justify-center px-6">
        <View className="bg-white w-full rounded-[32px] p-8 items-center shadow-2xl">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
            <Feather name="zap" size={36} color="#166534" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            New Version Available!
          </Text>

          <Text className="text-gray-500 text-center leading-6 mb-8 px-2">
            We've released some exciting new features and improvements to make your NutriScan experience even better.
          </Text>

          <TouchableOpacity
            onPress={handleDownload}
            disabled={isDownloading}
            className={`w-full py-4 rounded-full flex-row items-center justify-center ${
              isDownloading ? "bg-gray-100" : "bg-green-600 shadow-lg shadow-green-200"
            }`}
          >
            {isDownloading ? (
              <>
                <ActivityIndicator color="#166534" className="mr-2" />
                <Text className="text-green-800 font-bold text-lg">
                  Installing Update...
                </Text>
              </>
            ) : (
              <>
                <Feather name="download" size={20} color="white" className="mr-2" />
                <Text className="text-white font-bold text-lg ml-2">
                  Update Now
                </Text>
              </>
            )}
          </TouchableOpacity>

          {!isDownloading && (
            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              className="mt-4 py-2"
            >
              <Text className="text-gray-400 font-medium">Maybe later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};
