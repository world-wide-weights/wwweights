import {
  ImATeapotException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { EventStore } from '../../eventstore/eventstore';
import { InternalCommunicationService } from '../../internal-communication/internal-communication.service';
import { Item } from '../../models/item.model';
import { ImagesService } from './images.service';

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let internalCommunicationService = new InternalCommunicationService(
    null,
    null,
  );

  const mockEventstore: EventStore = { isReady: true } as any;
  const mockItemModel: ReturnModelType<typeof Item> = null;

  beforeAll(() => {
    imagesService = new ImagesService(
      mockEventstore,
      mockItemModel,
      internalCommunicationService,
    );
    jest
      .spyOn(imagesService, 'getItemCountForImage')
      .mockImplementation(async () => 0);
  });

  afterEach(() => {
    mockEventstore.isReady = true;
    jest
      .spyOn(imagesService, 'getItemCountForImage')
      .mockImplementation(async () => 0);
  });
  
  describe('promoteImageInImageBackend', () => {
    it('Should not call backend when eventstore is not ready', async () => {
      // ARRANGE
      mockEventstore.isReady = false;
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgAboutItemCreation')
        .mockImplementation(async () => {});
      // ACT
      await imagesService.promoteImageInImageBackend('validValue');
      // ASSERT
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('Should not call backend when passed undefined', async () => {
      // ARRANGE
      mockEventstore.isReady = false;
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgAboutItemCreation')
        .mockImplementation(async () => {});
      // ACT
      await imagesService.promoteImageInImageBackend(undefined);
      // ASSERT
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('Should not call backend when passed with an URL', async () => {
      // ARRANGE
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgAboutItemCreation')
        .mockImplementation(async () => {});
      // ACT
      await imagesService.promoteImageInImageBackend('http://google.com');
      // ASSERT
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('Should not call backend when image is already in use ', async () => {
      // ARRANGE
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgAboutItemCreation')
        .mockImplementation(async () => {});
      jest
        .spyOn(imagesService, 'getItemCountForImage')
        .mockImplementation(async () => 2);
      // ACT
      await imagesService.promoteImageInImageBackend('validValue');
      // ASSERT
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('Should call backend ', async () => {
      // ARRANGE
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgAboutItemCreation')
        .mockImplementation(async () => {});
      // ACT
      await imagesService.promoteImageInImageBackend('validValue');
      // ASSERT
      expect(apiCall).toHaveBeenCalled();
    });

    it('Should pass http exceptions ', async () => {
      // ARRANGE
      jest
        .spyOn(internalCommunicationService, 'notifyImgAboutItemCreation')
        .mockImplementation(async () => {
          throw new ImATeapotException();
        });
      // ACT
      await expect(
        async () =>
          await imagesService.promoteImageInImageBackend('validValue'),
      ).rejects.toThrowError(new ImATeapotException());
    });

    it('Should convert othr exceptions to InternalServerErrorException ', async () => {
      // ARRANGE
      jest
        .spyOn(internalCommunicationService, 'notifyImgAboutItemCreation')
        .mockImplementation(async () => {
          throw new InternalServerErrorException();
        });
      // ACT
      await expect(
        async () =>
          await imagesService.promoteImageInImageBackend('validValue'),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('demoteImageInImageBackend', () => {
    it('Should not call backend when eventstore is not ready', async () => {
      // ARRANGE
      mockEventstore.isReady = false;
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgImageObsoleteness')
        .mockImplementation(async () => {});
      // ACT
      await imagesService.demoteImageInImageBackend('validValue');
      // ASSERT
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('Should not call backend when passed undefined', async () => {
      // ARRANGE
      mockEventstore.isReady = false;
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgImageObsoleteness')
        .mockImplementation(async () => {});
      // ACT
      await imagesService.demoteImageInImageBackend(undefined);
      // ASSERT
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('Should not call backend when passed with an URL', async () => {
      // ARRANGE
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgImageObsoleteness')
        .mockImplementation(async () => {});
      // ACT
      await imagesService.demoteImageInImageBackend('http://google.com');
      // ASSERT
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('Should not call backend when image is still in use ', async () => {
      // ARRANGE
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgImageObsoleteness')
        .mockImplementation(async () => {});
      jest
        .spyOn(imagesService, 'getItemCountForImage')
        .mockImplementation(async () => 1);
      // ACT
      await imagesService.demoteImageInImageBackend('validValue');
      // ASSERT
      expect(apiCall).not.toHaveBeenCalled();
    });

    it('Should call backend ', async () => {
      // ARRANGE
      const apiCall = jest
        .spyOn(internalCommunicationService, 'notifyImgImageObsoleteness')
        .mockImplementation(async () => {});
      // ACT
      await imagesService.demoteImageInImageBackend('validValue');
      // ASSERT
      expect(apiCall).toHaveBeenCalled();
    });

    it('Should pass http exceptions ', async () => {
      // ARRANGE
      jest
        .spyOn(internalCommunicationService, 'notifyImgImageObsoleteness')
        .mockImplementation(async () => {
          throw new ImATeapotException();
        });
      // ACT
      await expect(
        async () => await imagesService.demoteImageInImageBackend('validValue'),
      ).rejects.toThrowError(ImATeapotException);
    });

    it('Should convert othr exceptions to InternalServerErrorException ', async () => {
      // ARRANGE
      jest
        .spyOn(internalCommunicationService, 'notifyImgImageObsoleteness')
        .mockImplementation(async () => {
          throw new InternalServerErrorException();
        });
      // ACT
      await expect(
        async () => await imagesService.demoteImageInImageBackend('validValue'),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
