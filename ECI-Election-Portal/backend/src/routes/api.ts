import { Router } from 'express';
import { getCandidates } from '../controllers/candidateController';
import { getTurnout } from '../controllers/turnoutController';
import { getCandidateAnalytics } from '../controllers/analyticsController';
import { createGrievance } from '../controllers/grievanceController';
import { registerVoter, verifyVoter } from '../controllers/voterController';
import { handleAIChat } from '../controllers/aiController';

const router = Router();

router.get('/candidates', getCandidates);
router.get('/turnout', getTurnout);
router.get('/analytics/candidates', getCandidateAnalytics);
router.post('/grievances', createGrievance);
router.post('/voters/register', registerVoter);
router.post('/voters/verify', verifyVoter);
router.post('/ai/chat', handleAIChat);

export default router;
