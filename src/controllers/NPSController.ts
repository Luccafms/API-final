import { getCustomRepository, Not, IsNull } from "typeorm";
import { Request, Response } from "express";
import { SurveyUserRepository } from "../repositories/SurveysUsersRepository";

class NPSController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository); 

    const surveyUser = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull())
    })

    const detractor = surveyUser.filter(
      (survey) => survey.value >= 0 && survey.value <= 6
      ).length;
      
      const promoter = surveyUser.filter(
        (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        const passive = surveyUser.filter(
          (survey) => survey.value >= 7 && survey.value <= 8
          ).length;

          const totalAnswers = surveyUser.length;

          const calculate = Number(
            ( ( (promoter - detractor) / totalAnswers ) * 100).toFixed(2)
            );

          return response.json({
            detractor,
            promoter,
            passive,
            totalAnswers,
            nps: calculate
          })
  }
}

export { NPSController };