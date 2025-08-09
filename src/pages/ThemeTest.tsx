import {
  AppBar,
  Toolbar,
  Box,
  Card,
  CardContent,
  CardActions,
  TextField,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import Typography from "../components/atoms/Typography";
import { CustomButton as Button } from "../components/atoms/CustomButton";

export default function ThemeTest() {
  return (
    <Box className="flex flex-col min-h-screen bg-bg-default">
      {/* Header */}
      <AppBar position="static" className="bg-primary shadow-elevation-2 ">
        <Toolbar>
          <Typography className="">AI Code Social Network</Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box className="flex flex-1">
        {/* Sidebar */}
        <Box
          component="nav"
          className="w-64 bg-secondary  p-6 flex flex-col gap-4"
        >
          <Typography variant="subtitle1" className="font-semibold">
            Navigation
          </Typography>
          <Button>Home</Button>
          <Button>Profile</Button>
          <Button className=" ">Work Showcase</Button>
        </Box>

        {/* Content */}
        <Box
          component="main"
          className="flex-1 p-8 bg-bg-paper shadow-elevation-1 rounded-l-md"
        >
          <Typography variant="h4" className="mb-6 font-sans ">
            Welcome Back, Developer!
          </Typography>

          {/* Cards Grid */}
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Example Card */}
            <Card className="bg-bg-default hover:bg-bg-hover cursor-pointer transition-colors rounded-md shadow-elevation-1">
              <CardContent>
                <Typography variant="h6" className="font-semibold  mb-2">
                  Latest AI Project
                </Typography>
                <Typography
                  variant="body2"
                  className=""
                  paragraph
                  tracking
                  leading
                >
                  Check out the latest project using GPT to generate automated
                  documentation.
                </Typography>
              </CardContent>
              <CardActions>
                <Button className="" size="small">
                  View
                </Button>
              </CardActions>
            </Card>

            <Card className="bg-bg-default hover:bg-bg-hover cursor-pointer transition-colors rounded-md shadow-elevation-1">
              <CardContent>
                <Typography variant="h6" className="font-semibold  mb-2">
                  Top Technologies
                </Typography>
                <Typography variant="body2" className="" paragraph>
                  Explore popular frameworks and languages used by our
                  community.
                </Typography>
              </CardContent>
              <CardActions>
                <Button className="  " size="small">
                  Explore
                </Button>
              </CardActions>
            </Card>

            <Card className="bg-bg-default hover:bg-bg-hover cursor-pointer transition-colors rounded-md shadow-elevation-1">
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-2">
                  Join AI Chats
                </Typography>
                <Typography variant="body2" className="" paragraph>
                  Chat with experts and discuss the latest AI trends.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  className="bg-success  hover:bg-success-hover"
                  size="small"
                >
                  Join
                </Button>
              </CardActions>
            </Card>
          </Box>

          <Divider className="my-6" />

          {/* Buttons Showcase */}
          <Stack direction="row" spacing={3} className="mb-8">
            <Button className="bg-primary  hover:bg-primary-hover">
              Primary
            </Button>
            <Button className="bg-secondary  hover:bg-secondary-hover">
              Secondary
            </Button>
            <Button className="bg-success  hover:bg-success-hover">
              Success
            </Button>
            <Button className="bg-warning  hover:bg-warning-hover">
              Warning
            </Button>
            <Button className="bg-error  hover:bg-error-hover">Error</Button>
            <Button
              disabled
              className="bg-primary-disabled  cursor-not-allowed"
            >
              Disabled
            </Button>
          </Stack>

          {/* Alerts */}
          <Stack spacing={2} className="mb-8">
            <Alert
              severity="success"
              className="bg-success border-none shadow-none"
            >
              <Typography>Operation completed successfully!</Typography>
            </Alert>
            <Alert
              severity="warning"
              className="bg-warning border-none shadow-none"
            >
              <Typography>Warning: Please verify your email.</Typography>
            </Alert>
            <Alert
              severity="error"
              className="bg-error  border-none shadow-none"
            >
              <Typography>Error: Something went wrong.</Typography>
            </Alert>
          </Stack>

          {/* Form Fields */}
          <Box component="form" className="max-w-md space-y-6">
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              className="bg-bg-paper rounded-md"
              InputLabelProps={{ className: "" }}
              InputProps={{
                className:
                  " bg-bg-paper rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary",
              }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              slotProps={{
                inputLabel: {
                  component: Typography,
                  code: true, // <-- TS now accepts this
                },
                input: { className: "rounded-md border border-border" },
              }}
              className="rounded-md disabled:bg-primary-disabled"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
