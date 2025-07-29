import unittest
import os
from app import app

class BasicTests(unittest.TestCase):

    def setUp(self):
	os.environ['TESTING'] = '1'
	self.app = app.test_client()

    def test_main_page(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode(), 'Hello, World! (mocked)')

if __name__ == "__main__":
    unittest.main()
