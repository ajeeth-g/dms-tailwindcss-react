import React from "react";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock, FilePlus2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Button from "./common/Button";
import TaskForm from "./TaskForm";
import SearchInput from "./common/SearchInput";

const users = [
  {
    id: 1,
    name: "GOPI",
    role: "HR Department",
    tasks: 3,
    completed: 2,
    documents: 5,
    pendingDocs: 2,
    image:
      "https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg",
    lastActive: "2 hrs ago",
    priority: "High",
  },
  {
    id: 2,
    name: "ANEES",
    role: "Admin",
    tasks: 2,
    completed: 2,
    documents: 3,
    pendingDocs: 1,
    image:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAygMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAACAAEDBAUGBwj/xABEEAABAwIEAwUDCAcGBwAAAAABAAIDBBEFEiExBhNBIlFhcYEUkaEjMkJSkrHB0QczQ1Nyc/AVFiQ1YuElNGOCg5Px/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAIxEAAgICAwACAwEBAAAAAAAAAAECEQMxEiFBBCIUMlFhE//aAAwDAQACEQMRAD8A9DDUWUJBEgYwaE4aEk6AEGp7BOkgBrJwEk6BDWSATp0wGsnDUQC5Tjzid2A0zIYIi6eZhdzM+URtGl/ikgOkq6mCjgdNVStiiYLuc42sgoK6jxKBs1BUxTxuFwY3A/BfPGJ4vW4lOHV088hA0MjybeV1nx1bqWrbLFMY5hoJIzY377jVMD6gypsq88/R5x9LiFTFg2Nva6oc0+z1d7CS30Xf6l6OWpDIbJrKQhNZAgCE1kRTIGMmRJkhoZNa6JMgYJamyokkgHCSZoKV1RNDoggBRAoAJJMCnQAVkrJrpXQIeycJgnCACFrb2XnPE2Gu4l41mpJn5KOipWBxbvmOtl6O3Tfbr5LjcGiqIhxBV1HKimqKoOjfJqBGRmbf0IUzdI0xxt2Z7eDMGigFqRji3bmarDxLgjCpHnJCIs2vYNrFdNQ40+etfQ2p6l4+nC8hw82uH4qri2JRQVDoGU89Q9ujuUB2T6kLjlyvpnoQUK7RwnEPBs2BUsdfTVXOpQ8A2JD4idv/AKvauE6uav4XwqrqXB801Kxz3D6RtuvOsdrW1vCdeWRTRmPK57Jm2I7Q26FegcEADg3BLDQ0UR97b/iurG212cOaKi+jYconEd6keoHRh+xN1oYic9t7Zh70IeOpVOXDM9UJ+Y8EC2W6tcgaWvsnQWOZG96HmhI0/mmFN4fFKh2OJAeqcvb9YJhT+Cf2f0RQWRy1cERaJJWtLjYXO6f2iP6wUNXhFPV5OewOyOzDwKsCgaABb4pUOx6UPNi83UUrvlCrVPaw8lUm/XP80MEx2vUgcoQpGhAEoKO6BqSYgwU6AFEEAEiCFFdAg7FzHNG5BCxqOBkdLUMcSJBJneSepH4aBbLVyPEtQ5lfW0ZmdA2eJrg/oDtf4LPIujfDLuibDaKCoqpK1rS+ZpLeaP61XNSYPFPiNTDO0yMqRnGYnfQm1itiHC6qlphfGZ4Z2OyxuLwWOb0PzbC4XJ1keLU2J5qbEG1L2kvu7WNngPNc7h6jtUlpmhimDMi4eqqSJ7i2VzOxnNiGuDiLna4BXc8HU8lJw/BHI45budEwm/Ljv2W+4fFczwzbH8WmgkOalpYgZHRnQyE6AeG/uXe2EbAxos1ugA6BbYoy2zlzzjVIGR2idn6tQyFTxj5JanKMd0N07kBTEFdLMhtdNZABZkg5DZPZIY+do3IR6quYA51y4qXXvQaNRWivhEnNpw5RzD5Z/moOGZOZSOH1TZTyn5Z/mkQhNGoUFbW+yZezfMrDVm4i+I1sQmcGsbuSqStjei5DWSSDSIqaKoL3lpBCaKpoWsGWdtyNNUEGr3OGyuUUl0Zxk3stXCe6hvYog5ZlkwKcFRZkTTdMCdp0WDxphTcToGcuzaqK5iePuPgbLXjmZLO6BhBe0dq3RVOLqj+y20VWdaXMYqg9GtOz/Q/AlKcZcWx42uaPPcQx2GohMdaaqhrItJGA2zW022PmuXrsRNeBS4eJngu7cj3bjuXrNfR01dTDnRRTC12kgOXOHCaakD3Rw2N9BZcnNfw71FvbOh/RzhsOG4G9jHZppH55XHc6aei6R6zcHo34Vg7y8h1QRzJLnS++UeQ0VuOrimaCCGkmwvouuKfHs4JtcnQn6kK1GPklUOrgrzRaMW7kySN1vRBduwcL+ap8Qvkjw2V8BIeG6WXI4BV4g/E43VHNdH1uLLWOLlFys483y1jyrHWzuy2yEorgi90JKyOtDJ0xKBz8ouUA2ShJBHJnF0d0PoadlDCIWU9ZUMicMrrOt3IZXf4h/mrFPLQRPe+MgPf8496lz0bnZtLlRFUivSqx+ywcap5a17mxHW+66tppelkuVR3vlFyqA4ykwaobLG+Q3a06rpoG2Yrr3UcQu+wCrsxHDc2Rszb+aZKdAlJWpREYc7CDfZR0UPtEhDjZrRd1kl2OwGNLwegB1J2COpcKKmfMTdzRueiuOlaz5LKOVtb+t1j8QkDC3RxDLne1uXuvZdEMf9MnNkHC9wHyyXIcd/LX8UqtlXjhkNQwCgLXM9mO7wRa5PeruE04pYXRnoLpUjyIy0b30WvRByWI0NVwxQwTsqH1eHh3LJc2zou4O/Pw8VpUslPLBDVhge9xtGHbB3fb+tl0NQYZqGcSszwysLZYz1WZhOGshjaQ0NZEMkTPqhc8fjRU+Xh0/kNw4+ioBPBzY5ZHyRTXvnNy09/ke5DBSF1RHDMSMsGbz1AWoI2jdRtaDUOkPRgZ6Zguhqzn5MhYTBGxrCCb7FX6PEKaqtGyQcwdBqPQrFrad00sNNchrmmWe2+W9mt9dfcmkY2BzWss22wCylApSs6KSFrwWuAI6hRiliZqGAeieknElM17jrsfRGXZmkt1UUEqB5Y6KGZzY9FDh89RNE/nR5bOIVjIDD2hqnKFFYpxv7IAG/RMW30IUgAbsmKyG9jNaG7I0IIT3HegZyEUvirkT7rFhmF91fhnapKNWNytM16LNZOGkZtNOqtxVcdjroOtkwLE3IGQTWu42APVZbIqeOaqkexjWtdvbZaskEVRy3vbmynM1Z/JbM2pjeLtc8ghaJdGfpao35m9l1220stqgBZQ5gBaQk3693uWJRMbEwMaLACwW/BpRQgfVv5Iguwk6RRqnjKbm3TVZta81GHlx+cyoha7zDtfvCvYq0iMv7IBs3exP5/BZGHPdKMRpJ2lsreTM0nZ7bkXH2QulGJvytEbpPEWWfHdsngtHENHRjv3VGVpa6/egZJGA58kJ1B1Cnta7e52/oFBCQK2E97CPgrTtS4gW1uQfIIEQSG11DTfKVA+rmsfvH3J53WvZQUsmSew3vcfZI/FNATQZKmqr5L/ADZGxA+TQbD7Sy8Ss19gCPBbTKZkEHIpiWgEukeN3OOp18Vl1QDnEkBS9FR2WsInYaV/NfkbcZQdz4/cr8U0BBZHI0uKqUFFDPSNdKwE5iFZjoYIXZmMAPgsk4pBLny/wEdlp7dvBZmE1Us1dPDJIC1h0C1zDHlN7rz/ABWpqabFKh9KJGDa4GhVwSnaOf5PyPxkpNWegEa7plUwNz34XC+YkyOAJurpAXPJU6OqD5JSALUso7kaeyRocj7BSulJhvq21htdWcOwplE3mVcmfqAdSp6dsdFEM3amOwUuUkc+rdlHcVzQs3l2BLTtqnGSRoawDRVJZGPHs9K0CMHV6aqqnVI0vHTj3uUUczTZsYAaNlon4QzoohaFg7gs6E6y/wAZWlH+pb5LKp9WyfzCuhGHpYjdYOK323bSR5Rd2XQLnmGwIPUrp5xlAb0ARj/Yc9GTLEA4vl+Uf9Z2w8lkVFQKPEaeeUkxOfynE7AO/wB7LaqhuuY4sgEmC1QMpZljLg9u4I1HxC6TKjpsXlyshlb0PwUVxNAJG9NViYLj9LV4Q2mqhUiRsekksd8x8LXW1RUdRTl3MAyOb82/VTFp6HKLjsCB9qmmPQFwPuKuyvysqXeI+4KiyOSlmZJLYsfIWsA3DiD+SnmbPJBK1jLE5Xan37KySrWyZXub5LKNc2HEQ1xPyYzmwuTpcfEBbE2EuqJxK+qytJBysbfYd6OLBKCN8r3xvlfJ84vd07hayiV10XDjf2LVFUCqoBNyyA86Ai2iyKxwEltlbqXmkpWiIZQ0lgaPmneyx3Sule1xF2yjM1x38QfFJpqPY1TlaOiws/4L/u/JWCVBh0ZjomA/S7SlK5y2OTooH0tPJ86NhPkpSUkWS4p7QmNbG0MYLAJiU90N0FLodOmCJIZgUuH4lHPG94jcLdu/f4J6jC8SqqrNK9nJaOzH4rWp5nyURlLrnLcELn+GcXrsTlkFRIAGk2yjxUcPC+T2FPw7Xzv7U7QwbNA2UsPDtTFb5QaLQx2WopMIqKmnmIkjYS0kaK1huafD6eaWQl8kYc63fZUoEuQAY9kYaQbgWVGnpZWh7XN+c66gx3EZaGsbEyUBpbfVUmYzOf2iHOgUDaNFLbYLdq35I7kFxIGUDclccMUqHC3MJv0supopvaMOp5ndWWdfv2V4pWyckaRBNG58ZzyBmmzbWHv3XO41hM+IYbNSxVUjBKAGuc0G+vgugltI4vmIbE06A/SP9dFC9ssxIiZy2Hdzx2j5Dp6rpavoxTo56gkjpXRw4gY6bluAuT2X2PQ/guyMrHbbeaw6nD4TFy5SXZvokA39FHTUstB+rq3Nj/dydoend6KceKMNF5Mjmbk1OKukfDctvq131XA3B9CoKOq5hMU3ydVFpIzb1HeCoYaqYMvJE8Do5gvf03RPjZM5ryQ5zNngEObf+tldGZbuNbHTuCHU7KEOLdHjNb6Q39yB9XGzqRfa6ABxaLnYfPG39Zlzs/iacw+5Y9C32ipbTsF28zMP9IO/4q1WVgfGWteASDYDUlWOGMNlghdVVAcx7ycrXCxt5KJukXA13AAWaLAKMhTuCAtXOaENkrKTKlkQBHZNbVSFqWVAAAJ0WVLKUDM2gaIsKLGnssaWj0XP8DC0kp8/vW7QvzYRM7pZyw+CBrIfBL0fhvcS/wCQVn8sq1g5/wCE0f8AKb9yqcTf5BWfyyrODa4TR2/dN+5UiTE4ynbRUctc2FsksNsrXdRdcH/fypBszC2eev5L0Li0uZhlTLGA9zbWZa99QuBz4mTeKgH/AKyopN9l9l/D+LMQqxZmHNBOxsV2GA4y9lPJDiTWx3OeMt2HeCuVoJMWcBzYAwDoIytaCpqDIGS0jnX65DorX17JkrOiixBlQ32iJkkkdyBI1hI0NjqjE8k2sYDR1I1P5BLAq/2XDBFNSSQuizeIf1JB6eS5zFuMIaiUigwrnkHWR7sgPhtf1W3/AES2RHFKf6qzf5zGuORvNd337PqevomizvcZHta+QdSLtb5bALPocWwyVrBUTS00kjgGMkYN+64FjturklbQRSOtUwzhjc5Has0XAGoBG5CtTi9MhwknTRoQEZMzrPPe3ZZnE1f7Dw/X1DCGubEcpJ+kdB8VDiOMQtlbDNXUtOXnRsjnC/gCQAqVWRiMENOaylMdw4iJwfmI2G6bafSYKEltGVh/EOJnDTHG18ziyzZJRa3iCdSp8LkxGS8mJSXYBaMFtjbvWkyi5IBGV3pYqZsccvYlaWu6P7liocVuzZzUnoDCXQUmJCqufmm/ktyLiOiqA4Q5nWOtgsinonR1Ia+xbe3ndWH00VNMWwsDQRrZRNhRfONU/wBR/uQnGoP3T/cqjQnLdFnY6LH9tQfu3+5M7HIB+yf9lV422KnyjuCLCgIOIaWoz8qOU5Tr2UZxqEbwy/ZWfhzQ2WoZYaPV1wRY6CONwD9lJ6tS/tyD91J9lQuahsiwoDDSf7uuPUtcsngMksJPVqSSYvDZx+V0vDtfm6NcFZw2V0WDUJZ1Y0fBJJUSzM40rpsPwasqqYtEjMpFxcbryt/6QMdZfK+Af+P/AHSSSitkybshH6QuIHOsZorfy16LwHjNZi1G59a9riB0bZJJacVRhylz2cpT8UYvJxXX0UlW51NEyVwjtYG2wNumquPrZKerdymsGV2gIukks/lKpKjrwyaix3YxO/E6KeSKB7og/IC02Gm++63qKvmqcMxCQ5Y3BjCCwf8AUb3pJLKOjoxdvs47iUufKQ97nBr7C5XKVUbJJGh7GmzCRcX7kkljbs9CcVSBiqKmnhLaeqqYmhwGWOZzRt3ArQw7iDGWzshGJ1BjcbWcQ74kXSSWsWzinFUe04S7OymcfpMa7fvF1Yqz/iSkkr8OZ7GajTJIEM356sAaBJJMDOof+bqv4lcKSSBglCkkkB//2Q==",
    lastActive: "30 mins ago",
    priority: "Medium",
  },
  {
    id: 3,
    name: "MUBARAK",
    role: "Manager",
    tasks: 4,
    completed: 3,
    documents: 2,
    pendingDocs: 1,
    image:
      "data:image/jpeg;base64,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",
    lastActive: "1 day ago",
    priority: "Low",
  },
];

const COLORS = ["#10B981", "#EF4444"]; // Green: Completed, Red: Pending

export default function CompactDMSDashboard() {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between gap-2 mb-8">
        <h2 className="text-lg font-semibold text-white">My Team</h2>
        <SearchInput />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {users.map((user) => {
          const pendingTasks = user.tasks - user.completed;
          const chartData = [
            { name: "Completed", value: user.completed },
            { name: "Pending", value: pendingTasks },
          ];

          return (
            <motion.div
              key={user.id}
              className="p-3 rounded-lg shadow-sm flex flex-col border border-gray-700 bg-gray-900"
              whileHover={{ scale: 1.02 }}
            >
              {/* Employee Info */}
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              </div>

              {/* Pie Chart & Stats */}
              <div className="flex items-center gap-3">
                <PieChart width={60} height={60}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={18}
                    outerRadius={28}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>

                <div className="text-xs text-gray-300">
                  <p>✅ {user.completed} Tasks</p>
                  <p>❌ {pendingTasks} Pending</p>
                  <p>📄 {user.documents} Docs</p>
                  <p
                    className={
                      user.pendingDocs > 0 ? "text-red-400" : "text-green-400"
                    }
                  >
                    ⚠️ {user.pendingDocs} Pending
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2">
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>Progress</span>
                  <span>
                    {Math.round((user.completed / user.tasks) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(user.completed / user.tasks) * 100}%`,
                      backgroundColor: "#10B981",
                    }}
                  />
                </div>
              </div>

              {/* Extra Info */}
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <p>
                  <Clock className="inline w-3 h-3 mr-1" /> {user.lastActive}
                </p>
                <p
                  className={`${
                    user.priority === "High"
                      ? "text-red-400"
                      : user.priority === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  ⚠️ {user.priority} Priority
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
