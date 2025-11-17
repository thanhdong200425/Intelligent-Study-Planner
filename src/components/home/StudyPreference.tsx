import React from "react";
import { Controller } from "react-hook-form";
import { Slider } from "@heroui/react";

interface StudyPreferencesProps {
  control: any;
}

const StudyPreferences: React.FC<StudyPreferencesProps> = ({ control }) => {
  return (
    <div>
      <h3 className="font-semibold text-lg text-slate-900 mb-4">
        Thói quen học tập
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Focus Duration */}
        <Controller
          name="focusDuration"
          control={control}
          render={({ field }) => (
            <Slider
              label="Thời gian tập trung (phút)"
              value={field.value}
              minValue={5}
              maxValue={60}
              step={5}
              onChange={(val) => field.onChange(val)} // val là number
              className="w-full"
            />
          )}
        />

        {/* Break Duration */}
        <Controller
          name="breakDuration"
          control={control}
          render={({ field }) => (
            <Slider
              label="Thời gian nghỉ ngơi (phút)"
              value={field.value}
              minValue={1}
              maxValue={20}
              step={1}
              onChange={(val) => field.onChange(val)}
              className="w-full"
            />
          )}
        />

        {/* Daily Goal */}
        <Controller
          name="dailyGoal"
          control={control}
          render={({ field }) => (
            <Slider
              label="Số phiên học mỗi ngày"
              value={field.value}
              minValue={1}
              maxValue={10}
              step={1}
              onChange={(val) => field.onChange(val)}
              className="w-full"
            />
          )}
        />

      </div>
    </div>
  );
};

export default StudyPreferences;
