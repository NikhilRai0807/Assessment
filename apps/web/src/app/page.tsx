import { Box, Container, Paper, Stack, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, rgba(21,94,239,0.08) 0%, rgba(248,250,252,1) 40%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 3, md: 6 } }}>
          <Stack spacing={2}>
            <Typography variant="overline" color="primary">
              Salary Management Assessment
            </Typography>
            <Typography variant="h3" component="h1">
              HR dashboard scaffolding is ready
            </Typography>
            <Typography color="text.secondary">
              Employee management and salary insights will be implemented
              incrementally with TDD in the next commits.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
