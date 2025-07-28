"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CVData } from "./cv-builder";

interface DebugInfoProps {
  data: CVData["personalInfo"];
  label: string;
}

export function DebugInfo({ data, label }: DebugInfoProps) {
  const [updateCount, setUpdateCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    setUpdateCount((prev) => prev + 1);
    setLastUpdate(new Date().toLocaleTimeString());
  }, [data]);

  return (
    <Card className="mb-4 border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-red-600">
          {label} - Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div>
          <strong>Update Count:</strong> {updateCount}
        </div>
        <div>
          <strong>Last Update:</strong> {lastUpdate}
        </div>
        <div>
          <strong>Full Name:</strong> "{data.fullName}"
        </div>
        <div>
          <strong>Title:</strong> "{data.title}"
        </div>
        <div>
          <strong>Email:</strong> "{data.email}"
        </div>
        <div>
          <strong>Data Object:</strong> {JSON.stringify(data, null, 2)}
        </div>
      </CardContent>
    </Card>
  );
}
