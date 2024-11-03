import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { ENDPOINT, WEBSOCKET_ENDPOINT } from "./constants";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import catjam from "./assets/catjam.webp";

const KioskPage = () => {
  document.title = "Queueing App - Kiosk";

  const [teams, setTeams] = useState([]);
  const { lastJsonMessage: data } = useWebSocket(
    `${WEBSOCKET_ENDPOINT}/queue`,
    {
      shouldReconnect: () => true,
    }
  );
  const [queued, setQueued] = useState([]);
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState("");

  useEffect(() => {
    const getTeams = async () => {
      const res = await fetch(`${ENDPOINT}/teams`);
      const teamsData = await res.json();
      setTeams(teamsData);
    };
    getTeams();
  }, []);

  useEffect(() => {
    if (data) {
      setQueued([
        ...data.nowServing.map((t) => t.number),
        ...data.queue.map((t) => t.number),
      ]);
    }
  }, [data]);

  const handleTeamClick = async (team) => {
    setTeam(team);
    setOpen(true);
  };

  const handleJoin = async () => {
    const res = await fetch(`${ENDPOINT}/add`, {
      method: "POST",
      body: JSON.stringify({ team }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200) {
      window.alert(`${team} is already in queue`);
    }
  };

  return (
    <>
      <Flex direction="column" gap="6">
        <Flex direction="row" align="center" justify="center" gap="4">
          <Text weight="bold" size="9" align="center">
            Join the Queue
          </Text>
          <img src={catjam} alt="catjam" width={64} height={64} />
        </Flex>
        <Flex direction="row" gap="3" wrap="wrap">
          {teams.map((t) => (
            <Button
              size="4"
              style={{ width: "120px", height: "60px" }}
              disabled={queued.includes(t.number)}
              onClick={() => handleTeamClick(t.number)}
            >
              {t.number}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content width="400px">
          <Text size="4" p="4">
            Add team <Text weight="bold">{team}</Text> to the queue?
          </Text>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
                size="3"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button size="3" onClick={handleJoin}>
                Join Queue
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default KioskPage;
