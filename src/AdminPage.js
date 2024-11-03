import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import ReactTimeAgo from "react-time-ago";
import catjump from "./assets/catjump.webp";
import donut from "./assets/donut.png";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  IconButton,
  Inset,
  Spinner,
  Table,
  Text,
} from "@radix-ui/themes";
import { WEBSOCKET_ENDPOINT, ENDPOINT } from "./constants";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";

const AdminPage = () => {
  document.title = "Queueing App - Admin";

  const [queue, setQueue] = useState([]);
  const [nowServing, setNowServing] = useState([]);
  const { lastJsonMessage: data } = useWebSocket(
    `${WEBSOCKET_ENDPOINT}/queue`,
    {
      shouldReconnect: () => true,
    }
  );

  const handleNext = async () => {
    await fetch(`${ENDPOINT}/serve`, { method: "POST" });
  };

  const handleRemove = async (team) => {
    await fetch(`${ENDPOINT}/remove`, {
      method: "POST",
      body: JSON.stringify({ team }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handleBack = async (team, amount) => {
    await fetch(`${ENDPOINT}/unserve`, {
      method: "POST",
      body: JSON.stringify({ team, amount }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    if (data) {
      setNowServing(data.nowServing);
      setQueue(data.queue);
    }
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Flex direction="column" gap="6">
      <Flex direction="row" align="center" justify="center" gap="4">
        <Text weight="bold" size="9" align="center">
          Admin Page
        </Text>
        <img src={donut} alt="chipi" width={64} height={64} />
      </Flex>
      <Flex direction="row" gap="6" mt="4">
        <Flex width="600px" gap="4" direction="column">
          <Flex direction="row" align="center" justify="center" gap="2">
            <Text weight="bold" size="7" align="center">
              Up Next
            </Text>
            <img src={catjump} alt="catjump" width={32} height={32} />
          </Flex>
          <Button onClick={handleNext} size="4">
            <ChevronLeftIcon />
            Queue next team
          </Button>
          <Card>
            <Inset>
              <Flex
                direction="column"
                style={{ backgroundColor: "rgba(0,130,255, 0.1)" }}
                minHeight="300px"
              >
                <Table.Root size="1">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell>Team</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify="center">
                        Remove
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell justify="center">
                        Move back
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {nowServing.map((team, index) => (
                      <Table.Row>
                        <Table.Cell>
                          <Text key={index} size="4" weight="bold">
                            {team.number}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text size="4" weight="bold">
                            <ReactTimeAgo
                              date={team.at}
                              locale="en-US"
                              timeStyle="mini"
                            />
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex justify="center">
                            <IconButton
                              color="crimson"
                              variant="surface"
                              onClick={() => handleRemove(team.number)}
                            >
                              <Cross2Icon />
                            </IconButton>
                          </Flex>
                        </Table.Cell>
                        <Table.Cell>
                          <Flex direction="row" gap="2" justify="center">
                            <Button
                              onClick={() => handleBack(team.number)}
                              variant="surface"
                            >
                              <ChevronRightIcon />
                            </Button>
                            <Button
                              onClick={() => handleBack(team.number, 5)}
                              variant="surface"
                            >
                              <ChevronRightIcon />
                              5x
                            </Button>
                          </Flex>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
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
              <Box minHeight="300px" px="4">
                <ol>
                  <Grid columns="3" gap="2">
                    {queue.map((team, index) => (
                      <li
                        key={index}
                        style={{ listStyle: "decimal", fontSize: "22px" }}
                      >
                        <Grid columns="2">
                          <Text size="7" weight="bold">
                            {team.number}
                          </Text>
                          <IconButton
                            color="crimson"
                            variant="surface"
                            onClick={() => handleRemove(team.number)}
                          >
                            <Cross2Icon />
                          </IconButton>
                        </Grid>
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

    // <div className="flex flex-row space-x-12 max-h-[90vh]">
    //   <div className="w-[400px] space-y-4">
    //     <p className="text-4xl font-bold mb-4">Up Next</p>
    //     <button
    //       className="btn btn-primary btn-lg btn-block"
    //       onClick={handleNext}
    //     >
    //       Add team to Up Next (⌫)
    //     </button>

    //     <div
    //       className="text-2xl font-bold p-4"
    //       style={{ backgroundColor: '#db0f00' }}
    //     >
    //       {nowServing.map((team, index) => (
    //         <p key={index} className="mb-1">
    //           <div className="flex flex-row">
    //             <div className="w-32">{team.number}</div>
    //             <div className="w-24">
    //               <ReactTimeAgo
    //                 date={team.at}
    //                 locale="en-US"
    //                 timeStyle="mini"
    //               />
    //             </div>
    //             <button
    //               className="btn btn-primary btn-sm"
    //               onClick={() => handleRemove(team.number)}
    //             >
    //               Remove
    //             </button>
    //             <button
    //               className="btn btn-primary btn-sm ml-2"
    //               onClick={() => handleBack(team.number)}
    //             >
    //               Move back
    //             </button>
    //           </div>
    //         </p>
    //       ))}
    //     </div>
    //   </div>
    //   <div className="w-3/4">
    //     <p className="text-4xl font-bold mb-4">Current Queue</p>
    //     <ol className="list-decimal text-xl columns-3 px-8">
    //       {queue.map((team, index) => (
    //         <div key={index} className="flex flex-row mb-2">
    //           <li className="w-24">{team.number}</li>
    //           <button
    //             className="btn btn-primary btn-sm"
    //             onClick={() => handleRemove(team.number)}
    //           >
    //             Remove
    //           </button>
    //         </div>
    //       ))}
    //     </ol>
    //   </div>
    // </div>
  );
};

export default AdminPage;
