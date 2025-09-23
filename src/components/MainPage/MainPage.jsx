import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";

const MainPage = () => {
  // 장 시작/마감 시간 고정
  const marketOpen = new Date();
  marketOpen.setHours(8, 0, 0, 0);   // 오전 8시
  const marketClose = new Date();
  marketClose.setHours(17, 0, 0, 0); // 오후 5시

  const [data, setData] = useState([
    {
      id: "stock-price",
      data: [],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
          x: new Date(), // ✅ 현재 시각(Date 객체)
          y: 60000 + Math.random() * 5000,
        };
        return [
          {
            id: "stock-price",
            data: [...prev[0].data, newPoint],
          },
        ];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ height: "400px", width: "800px" }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          xScale={{
            type: "time",
            format: "native",
            min: marketOpen,
            max: marketClose,
          }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          axisBottom={{
            format: "%H:%M",
            tickValues: "every 1 hour", // 1시간 간격 눈금
            legend: "시간",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            legend: "가격",
            legendOffset: -40,
            legendPosition: "middle",
            format: value => `${value.toLocaleString()}원`,
          }}
          colors={["#6d55ff"]}
          lineWidth={2}
          enablePoints={false}
          enableArea={true}
          areaOpacity={0.15}
          useMesh={true}
        />
      </div>
    </div>
  );
};

export default MainPage;
