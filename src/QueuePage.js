import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import ReactTimeAgo from "react-time-ago";
import catjump from "./assets/catjump.webp";
import wahoo from "./assets/wahoo.webp";
import chipi from "./assets/chipi.webp";
import penguin from "./assets/penguin.webp";
import { WEBSOCKET_ENDPOINT } from "./constants";
import {
  Box,
  Callout,
  Card,
  Flex,
  Grid,
  Inset,
  Separator,
  Spinner,
  Text,
} from "@radix-ui/themes";

const QueuePage = () => {
  document.title = "Queueing App - Queue";
  const [queue, setQueue] = useState([]);
  const [nowServing, setNowServing] = useState([]);
  const [flash, setFlash] = useState(false);
  const { lastJsonMessage: data } = useWebSocket(
    `${WEBSOCKET_ENDPOINT}/queue`,
    {
      shouldReconnect: () => true,
    }
  );

  let blinkInterval;

  const flashRed = () => {
    let count = 0;
    blinkInterval = setInterval(() => {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
      }, 400);
      if (count++ === 4) clearInterval(blinkInterval);
    }, 800);
  };

  useEffect(() => {
    if (data) {
      if (nowServing.length < data.nowServing.length) {
        flashRed();
      }
      setNowServing(data.nowServing);
      setQueue(data.queue);
    }
  }, [data]);

  return (
    <Flex direction="column" gap="6">
      <Flex direction="row" align="center" justify="center" gap="4">
        <Text weight="bold" size="9" align="center">
          Skills Queue
        </Text>
        <img src={chipi} alt="chipi" width={64} height={64} />
      </Flex>
      <Callout.Root size="3" style={{ justifyContent: "center" }}>
        <Callout.Text>
          <Text size="6" align="center">
            Come to the queueing desk when your team is displayed in the Up Next
            box
          </Text>
        </Callout.Text>
      </Callout.Root>
      <Flex direction="row" gap="6" mt="4">
        <Flex width="450px" gap="4" direction="column">
          <Flex direction="row" align="center" justify="center" gap="2">
            <Text weight="bold" size="7" align="center">
              Up Next
            </Text>
            <img src={catjump} alt="catjump" width={32} height={32} />
          </Flex>
          <Card style={{ backgroundColor: "rgba(0,130,255,1)" }}>
            <Inset>
              <Flex
                p="4"
                direction="column"
                gap="2"
                style={{
                  backgroundColor: flash ? "transparent" : "rgb(0,130,255)",
                }}
                minHeight="300px"
              >
                <Grid columns="2">
                  <Flex direction="row" align="center" gap="2">
                    <Text size="5" style={{ color: "white" }}>
                      Team #
                    </Text>
                  </Flex>
                  <Flex direction="row" align="center" gap="1">
                    <Text size="5" style={{ color: "white" }}>
                      Time Past
                    </Text>
                    <img src={wahoo} alt="wahoo" width={40} height={32} />
                  </Flex>
                </Grid>
                <Separator size="4" style={{ backgroundColor: "white" }} />
                <Grid columns="1fr 1fr" gap="2">
                  {nowServing.map((team, index) => (
                    <>
                      <Text
                        key={index}
                        size="7"
                        style={{ color: "white" }}
                        weight="bold"
                      >
                        {team.number}
                      </Text>
                      <Text size="7" style={{ color: "white" }} weight="bold">
                        <ReactTimeAgo
                          date={team.at}
                          locale="en-US"
                          timeStyle="mini"
                        />
                      </Text>
                    </>
                  ))}
                </Grid>
              </Flex>
            </Inset>
          </Card>
        </Flex>

        <Flex gap="4" direction="column" width="100%">
          <Flex direction="row" gap="2" align="center" justify="center">
            <Text weight="bold" size="7" align="center">
              Current Queue
            </Text>
            <Spinner size="3" />
          </Flex>
          <Card>
            <Inset>
              <Callout.Root
                size="1"
                variant="surface"
                style={{ justifyContent: "center" }}
              >
                <Callout.Text>
                  <Flex direction="row" align="center">
                    <Text size="4" align="center">
                      Join the queue through on tablet below
                    </Text>
                    <img src={penguin} alt="penguin" width={32} height={32} />
                  </Flex>
                </Callout.Text>
              </Callout.Root>
              <Box minHeight="300px" px="4">
                <ol>
                  <Grid columns="3" gap="2">
                    {queue.map((team, index) => (
                      <li
                        key={index}
                        style={{ listStyle: "decimal", fontSize: "22px" }}
                      >
                        <Text size="7" weight="bold">
                          {team.number}
                        </Text>
                      </li>
                    ))}
                  </Grid>
                </ol>
              </Box>
            </Inset>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  );
};

/**
 * 
 * 
    <div className="flex flex-row space-x-12 max-h-[90vh]">
      <div className="w-[400px]">
        <p className="text-4xl font-bold mb-4">Up Next</p>
        <div
          className="text-5xl font-bold p-4"
          style={{ backgroundColor: flash ? 'transparent' : '#db0f00' }}
        >
          {nowServing.map((team, index) => (
            <p key={index} className="mb-1">
              <div className="flex flex-row">
                <div className="w-56">{team.number}</div>
                <ReactTimeAgo date={team.at} locale="en-US" timeStyle="mini" />
              </div>
            </p>
          ))}
        </div>
      </div>
      <div className="w-3/4">
        <p className="text-4xl font-bold mb-4">Current Queue</p>
        <ol className="list-decimal text-3xl columns-3 px-8">
          {queue.map((team, index) => (
            <li key={index}>{team.number}</li>
          ))}
        </ol>
      </Box>
    </Flex>
 */

export default QueuePage;
