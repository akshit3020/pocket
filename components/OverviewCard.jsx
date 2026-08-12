import { Text, View } from "react-native";

const OverviewCard = ({ title, value, description }) => {
  return (
    <View className="box w-[48%]">
      <Text className="mt-1 text-xs uppercase tracking-widest text-neutral-200">
        {title}
      </Text>
      <View className="my-2 h-[2px] w-full rounded-full bg-indigo-700" />

      <Text className="text-3xl font-semibold text-white">{value}</Text>

      <Text className="mt-2 text-xs leading-4 text-neutral-400">
        {description}
      </Text>
    </View>
  );
};

export default OverviewCard;
