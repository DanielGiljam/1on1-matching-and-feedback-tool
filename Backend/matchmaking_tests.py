import unittest
import matchmaking
import datetime
import random

class TestMatchmaking(unittest.TestCase):

  def setUp(self):
    random.seed(1)
    self.feedbacks = []
    for i in range(10):
      for j in range(10):
        self.feedbacks.append({
          'startup': i,
          'startupfeedback': random.choice([-1,0,1,3]),
          'coach': j,
          'coachfeedback': random.choice([-1,0,1,2])
        })
    self.availabilities = {}
    for i in range(10):
      self.availabilities[i] = {
      'starttime': str(random.randrange(9,12))+ ":00:00",
      'duration': random.randrange(0, 240, 40)
      }
    testData = {'feedbacks': self.feedbacks, 'availabilities': self.availabilities}
    self.paramTuple = matchmaking.init(True, testData)
    self.definedFeedbacks = [];
    userid = 0;
    for i in [-1,0,1,3]:
        userid += 1
        for j in [-1,0,1,2]:
            self.definedFeedbacks.append({
              'startup': userid,
              'startupfeedback': i,
              'coach': userid,
              'coachfeedback': j
            })
    self.definedAvailabilities = {};
    self.definedAvailabilities[1] = {
      'starttime': "09:00:00",
      'duration': 240
    }
    self.definedAvailabilities[2] = {
      'starttime': "09:00:00",
      'duration': 120
    }
    self.definedAvailabilities[3] = {
      'starttime': "10:00:00",
      'duration': 120
    }
    definedTestData = {'feedbacks': self.definedFeedbacks, 'availabilities': self.definedAvailabilities}
    self.definedParamTuple = matchmaking.init(True, definedTestData)
    self.definedAvailabilities = self.definedParamTuple[1]


  def tearDown(self):
    pass

  def test_getSum(self):
    self.assertEqual(matchmaking.getSum(0,0),0)
    self.assertEqual(matchmaking.getSum(0,1),1)
    self.assertEqual(matchmaking.getSum(-1,0),0)
    self.assertEqual(matchmaking.getSum(-1,-1),2.5)
    self.assertEqual(matchmaking.getSum(2,3),5)
    self.assertEqual(matchmaking.getSum(-1,2),2)

  def test_matchmake(self):
    print(matchmaking.matchmake(self.paramTuple[0], self.paramTuple[1], self.paramTuple[2]))

  def test_cmpByFeedback(self):
    self.assertEqual(matchmaking.cmpByFeedback(self.definedFeedbacks[0],self.definedFeedbacks[0]),0)
    self.assertEqual(matchmaking.cmpByFeedback(self.definedFeedbacks[0],self.definedFeedbacks[4]),2)
    self.assertEqual(matchmaking.cmpByFeedback(self.definedFeedbacks[0],self.definedFeedbacks[8]),1)
    self.assertEqual(matchmaking.cmpByFeedback(self.definedFeedbacks[0],self.definedFeedbacks[12]),0)
    self.assertEqual(matchmaking.cmpByFeedback(self.definedFeedbacks[4],self.definedFeedbacks[0]),-2)
    self.assertEqual(matchmaking.cmpByFeedback(self.definedFeedbacks[8],self.definedFeedbacks[0]),-1)
    self.assertEqual(matchmaking.cmpByFeedback(self.definedFeedbacks[12],self.definedFeedbacks[0]),0)

  def test_cmpByTimestart(self):
    self.assertEqual(matchmaking.cmpByTimestart(self.definedFeedbacks[0],self.definedFeedbacks[0],self.definedAvailabilities),0)
    self.assertEqual(matchmaking.cmpByTimestart(self.definedFeedbacks[0],self.definedFeedbacks[4],self.definedAvailabilities),0)
    self.assertEqual(matchmaking.cmpByTimestart(self.definedFeedbacks[0],self.definedFeedbacks[8],self.definedAvailabilities),-3600)
    self.assertEqual(matchmaking.cmpByTimestart(self.definedFeedbacks[0],self.definedFeedbacks[8],self.definedAvailabilities),3600)



if __name__ == '__main__':
    unittest.main()
