import { Box, Grid, Typography } from "@mui/material";

import AnalyticCard from "../cards/components/AnalyticCard.js";
import CheckListItem from "../cards/components/CheckListItem.js";
import EventCard, {
  EventChip,
  EventCarousel,
} from "../cards/components/EventCard.js";
import TicketCard, {
  TicketsBox,
  TicketChip,
} from "../cards/components/TicketCard.js";
import DashboardLabel from "../common/DashboardLabel.tsx";

export default function Dashboard(): JSX.Element {
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DashboardLabel children="Events" />
          <EventCarousel deviceType={"desktop"} arrows={false}>
            <EventChip label="Top attendance" />
            <EventChip label="The closest" />
            <EventChip label="A-Z" />
            <EventChip label="Z-A" />
            <EventChip label="High price" />
            <EventChip label="Low price" />
          </EventCarousel>
          <EventCarousel deviceType={"desktop"} arrows={false}>
            <Box sx={{ padding: 1 }}>
              <EventCard
                name="Event Name"
                date="10 Nov 2022"
                time="10AM - 8PM(GMT-7)"
              />
            </Box>
            <Box sx={{ padding: 1 }}>
              <EventCard
                name="Event Name"
                date="10 Nov 2022"
                time="10AM - 8PM(GMT-7)"
              />
            </Box>
            <Box sx={{ padding: 1 }}>
              <EventCard
                name="Event Name"
                date="10 Nov 2022"
                time="10AM - 8PM(GMT-7)"
              />
            </Box>
            <Box sx={{ padding: 1 }}>
              <EventCard
                name="Event Name"
                date="10 Nov 2022"
                time="10AM - 8PM(GMT-7)"
              />
            </Box>
          </EventCarousel>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ py: 3 }}>
        <Grid item xs={12} lg={5}>
          <TicketsBox>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DashboardLabel children="Tickets" />
                <EventCarousel deviceType={"desktop"} arrows={false}>
                  <TicketChip label="Top attendance" />
                  <TicketChip label="The closest" />
                  <TicketChip label="A-Z" />
                  <TicketChip label="Z-A" />
                  <TicketChip label="High price" />
                  <TicketChip label="Low price" />
                </EventCarousel>
                <Box className={"cardArea"}>
                  <Box sx={{ mb: 2 }}>
                    <TicketCard
                      name="Ticket Name"
                      date="10 Nov 2022"
                      time="10AM - 8PM(GMT-7)"
                      description="Taking the risk is worth the reward—grow your network for better company profit."
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TicketCard
                      name="Ticket Name"
                      date="10 Nov 2022"
                      time="10AM - 8PM(GMT-7)"
                      description="Taking the risk is worth the reward—grow your network for better company profit."
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TicketCard
                      name="Ticket Name"
                      date="10 Nov 2022"
                      time="10AM - 8PM(GMT-7)"
                      description="Taking the risk is worth the reward—grow your network for better company profit."
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TicketCard
                      name="Ticket Name"
                      date="10 Nov 2022"
                      time="10AM - 8PM(GMT-7)"
                      description="Taking the risk is worth the reward—grow your network for better company profit."
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TicketCard
                      name="Ticket Name"
                      date="10 Nov 2022"
                      time="10AM - 8PM(GMT-7)"
                      description="Taking the risk is worth the reward—grow your network for better company profit."
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </TicketsBox>
        </Grid>
        <Grid item xs={12} lg={7}>
          <DashboardLabel children="Analytics" />
          <Grid container spacing={2}>
            <Grid item sx={12} sm={4}>
              <AnalyticCard id={0} amount={223} />
            </Grid>
            <Grid item sx={12} sm={4}>
              <AnalyticCard id={1} amount={23} />
            </Grid>
            <Grid item sx={12} sm={4}>
              <AnalyticCard id={2} amount={54} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CheckListItem eventType={0} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CheckListItem eventType={1} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CheckListItem eventType={2} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CheckListItem eventType={3} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CheckListItem eventType={4} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
