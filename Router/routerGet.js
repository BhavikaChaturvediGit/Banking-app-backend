router.get('/api/staff/:id', async (req, res) => {
    try {
      const staff = await Staff.findById(req.params.id).populate('details');
      if (!staff) {
        return res.status(404).send('Staff not found');
      }
      res.send(staff);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  