import React from "react";
import { View, Text } from "react-native";
import { ToastHost } from "./ToastHost";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Optionally log error to a service
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ color: "#b91c1c", fontSize: 18, marginBottom: 8 }}>
            Something went wrong.
          </Text>
          <Text style={{ color: "#b91c1c", fontSize: 14, textAlign: "center" }}>
            {this.state.error?.message ||
              "An unexpected error occurred. Please restart the app."}
          </Text>
          <ToastHost />
        </View>
      );
    }
    return this.props.children;
  }
}
