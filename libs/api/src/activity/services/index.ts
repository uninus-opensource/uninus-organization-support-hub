import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as schema from '../../common/models';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  lt,
  or,
  arrayContained,
  ne,
} from 'drizzle-orm';
import {
  EActivityStatus,
  EActivityStatusTranslation,
  EChartType,
  EPaginationOrderBy,
  TActivityRequest,
  TActivityResponse,
  TActivitySingleResponse,
  TChartRequest,
  TChartResponse,
  TPaginationRequest,
  monthNames,
} from '@psu/entities';

@Injectable()
export class ActivityService {
  constructor(
    @Inject('drizzle') private drizzle: NodePgDatabase<typeof schema>
  ) {}

  async submission(data: TPaginationRequest): Promise<TActivityResponse> {
    const {
      page = 1,
      perPage = 10,
      orderBy,
      search,
      organizationId,
      status,
    } = data;
    const orderByFunction = orderBy == EPaginationOrderBy.DESC ? desc : asc;
    const [res, count] = await Promise.all([
      this.drizzle
        .select({
          id: schema.activities.id,
          name: schema.activities.name,
          status: schema.activities.status,
          startDate: schema.activities.startDate,
          endDate: schema.activities.endDate,
        })
        .from(schema.activities)
        .where(
          and(
            ne(schema.activities.status, EActivityStatus.NOTREPORTED),
            ne(schema.activities.status, EActivityStatus.REPORTED),
            ...(search ? [ilike(schema.activities.name, `%${search}%`)] : []),
            ...(status ? [eq(schema.activities.status, status)] : []),
            ...(organizationId
              ? [eq(schema.activities.organizationId, organizationId)]
              : [])
          )
        )
        .limit(Number(perPage))
        .offset((Number(page) - 1) * Number(perPage))
        .orderBy(orderByFunction(schema.activities.name)),
      this.drizzle
        .select({
          id: schema.activities.id,
        })
        .from(schema.activities)
        .where(
          and(
            ne(schema.activities.status, EActivityStatus.NOTREPORTED),
            ne(schema.activities.status, EActivityStatus.REPORTED),
            ...(search ? [ilike(schema.activities.name, `%${search}%`)] : []),
            ...(status ? [eq(schema.activities.status, status)] : []),
            ...(organizationId
              ? [eq(schema.activities.organizationId, organizationId)]
              : [])
          )
        )
        .then((res) => res.length),
    ]);

    if (!res) {
      throw new NotFoundException('Kegiatan tidak ditemukan');
    }
    const lastPage = Math.ceil(count / Number(perPage));
    return {
      data: res,
      meta: {
        total: count,
        totalPage: Math.ceil(count / Number(perPage)),
        lastPage,
        currentPage: Number(page),
        perPage: Number(perPage),
        prev: Number(page) > 1 ? Number(page) - 1 : null,
        next: Number(page) < lastPage ? Number(page) + 1 : null,
      },
    };
  }

  async report(data: TPaginationRequest): Promise<TActivityResponse> {
    const {
      page = 1,
      perPage = 10,
      orderBy,
      search,
      organizationId,
      status,
    } = data;
    const orderByFunction = orderBy == EPaginationOrderBy.DESC ? desc : asc;
    const [res, count] = await Promise.all([
      this.drizzle
        .select({
          id: schema.activities.id,
          name: schema.activities.name,
          status: schema.activities.status,
          startDate: schema.activities.startDate,
          endDate: schema.activities.endDate,
        })
        .from(schema.activities)
        .where(
          and(
            ...(search ? [ilike(schema.activities.name, `%${search}%`)] : []),
            ...(status === EActivityStatusTranslation.NOTREPORTED
              ? [eq(schema.activities.status, EActivityStatus.NOTREPORTED)]
              : status === EActivityStatusTranslation.REPORTED
              ? [eq(schema.activities.status, EActivityStatus.REPORTED)]
              : [
                  and(
                    eq(schema.activities.status, EActivityStatus.NOTREPORTED),
                    eq(schema.activities.status, EActivityStatus.REPORTED)
                  ),
                ]),
            ...(organizationId
              ? [eq(schema.activities.organizationId, organizationId)]
              : [])
          )
        )
        .limit(Number(perPage))
        .offset((Number(page) - 1) * Number(perPage))
        .orderBy(orderByFunction(schema.activities.name)),
      this.drizzle
        .select({
          id: schema.activities.id,
        })
        .from(schema.activities)
        .where(
          and(
            ...(search ? [ilike(schema.activities.name, `%${search}%`)] : []),
            ...(status === EActivityStatusTranslation.NOTREPORTED
              ? [eq(schema.activities.status, EActivityStatus.NOTREPORTED)]
              : status === EActivityStatusTranslation.REPORTED
              ? [eq(schema.activities.status, EActivityStatus.REPORTED)]
              : [
                  and(
                    eq(schema.activities.status, EActivityStatus.NOTREPORTED),
                    eq(schema.activities.status, EActivityStatus.REPORTED)
                  ),
                ]),
            ...(organizationId
              ? [eq(schema.activities.organizationId, organizationId)]
              : [])
          )
        )
        .then((res) => res.length),
    ]);

    if (!res) {
      throw new NotFoundException('Kegiatan tidak ditemukan');
    }
    const lastPage = Math.ceil(count / Number(perPage));
    return {
      data: res,
      meta: {
        total: count,
        totalPage: Math.ceil(count / Number(perPage)),
        lastPage,
        currentPage: Number(page),
        perPage: Number(perPage),
        prev: Number(page) > 1 ? Number(page) - 1 : null,
        next: Number(page) < lastPage ? Number(page) + 1 : null,
      },
    };
  }

  async approval(data: TPaginationRequest): Promise<TActivityResponse> {
    const { page = 1, perPage = 10, orderBy, search, userId, status } = data;
    const orderByFunction = orderBy == EPaginationOrderBy.DESC ? desc : asc;
    const [res, count] = await Promise.all([
      this.drizzle
        .select({
          id: schema.activities.id,
          name: schema.activities.name,
          status: schema.activities.status,
          startDate: schema.activities.startDate,
          endDate: schema.activities.endDate,
        })
        .from(schema.activities)
        .where(
          and(
            ...(search ? [ilike(schema.activities.name, `%${search}%`)] : []),
            arrayContained(schema.activities.reviewers, [`${userId}`])
          )
        )
        .limit(Number(perPage))
        .offset((Number(page) - 1) * Number(perPage))
        .orderBy(orderByFunction(schema.activities.name)),
      this.drizzle
        .select({
          id: schema.activities.id,
        })
        .from(schema.activities)
        .where(
          and(
            ...(search ? [ilike(schema.activities.name, `%${search}%`)] : []),
            arrayContained(schema.activities.reviewers, [`${userId}`])
          )
        )
        .then((res) => res.length),
    ]);

    if (!res) {
      throw new NotFoundException('Kegiatan tidak ditemukan');
    }
    const lastPage = Math.ceil(count / Number(perPage));
    return {
      data: res,
      meta: {
        total: count,
        totalPage: Math.ceil(count / Number(perPage)),
        lastPage,
        currentPage: Number(page),
        perPage: Number(perPage),
        prev: Number(page) > 1 ? Number(page) - 1 : null,
        next: Number(page) < lastPage ? Number(page) + 1 : null,
      },
    };
  }

  async findOne(id: string): Promise<TActivitySingleResponse> {
    const res = await this.drizzle
      .select({
        id: schema.activities.id,
        name: schema.activities.name,
        lead: schema.activities.lead,
        proposal: schema.activities.proposal,
        description: schema.activities.description,
        location: schema.activities.location,
        startDate: schema.activities.startDate,
        endDate: schema.activities.endDate,
        budget: schema.activities.budget,
        status: schema.activities.status,
        organization: {
          id: schema.organizations.id,
          name: schema.organizations.name,
        },
        createdAt: schema.activities.createdAt,
        updatedAt: schema.activities.updatedAt,
      })
      .from(schema.activities)
      .leftJoin(
        schema.organizations,
        eq(schema.activities.organizationId, schema.organizations.id)
      )
      .where(eq(schema.activities.id, id))
      .then((res) => res.at(0));

    if (!res) {
      throw new NotFoundException('Kegiatan tidak ditemukan');
    }
    return {
      message: 'Berhasil mengambil data kegiatan',
      data: res,
    };
  }
  async delete(id: string): Promise<TActivitySingleResponse> {
    const res = await this.drizzle
      .delete(schema.activities)
      .where(eq(schema.activities.id, id))
      .returning({
        id: schema.activities.id,
      })
      .then((res) => res.at(0));

    if (!res) {
      throw new NotFoundException('Kegiatan tidak ditemukan');
    }
    return {
      message: 'Berhasil menghapus kegiatan',
      data: res,
    };
  }
  async update(data: TActivityRequest): Promise<TActivitySingleResponse> {
    const { id, ...resdata } = data;
    const res = await this.drizzle
      .update(schema.activities)
      .set(resdata)
      .where(eq(schema.activities.id, id as string))
      .returning({
        id: schema.activities.id,
      })
      .then((res) => res.at(0));

    if (!res) {
      throw new NotFoundException('Kegiatan tidak ditemukan');
    }
    return {
      message: 'Berhasil update kegiatan',
      data: res,
    };
  }
  async create(data: TActivityRequest): Promise<TActivitySingleResponse> {
    const res = await this.drizzle
      .insert(schema.activities)
      .values({
        name: data.name as string,
        lead: data.lead as string,
        proposal: data.proposal as string,
        description: data.description as string,
        location: data.location as string,
        startDate: data.startDate as Date,
        endDate: data.endDate as Date,
        budget: data.budget as string,
        organizationId: data.organizationId as string,
        reviewers: [],
      })
      .returning({
        id: schema.activities.id,
      })
      .then((res) => res.at(0));

    if (!res) {
      throw new NotFoundException('Kegiatan tidak ditemukan');
    }
    return {
      message: 'Berhasil menambahkan kegiatan',
      data: res,
    };
  }
  async chart(data: TChartRequest): Promise<TChartResponse> {
    const { type = EChartType.PIE, status, month, organizationId, role } = data;
    const now = new Date();
    const currentYear = now.getFullYear();
    const monthIndex =
      month &&
      monthNames.findIndex(
        (name) => name.toLowerCase() === month.toLowerCase()
      );
    const currentMonth = (month ? monthIndex : now.getMonth()) as number;

    if (type === EChartType.LINE) {
      const dayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const dayOfLastWeeks = dayOfMonth - 21;
      const firstWeek = {
        start: new Date(currentYear, currentMonth, 1),
        end: new Date(currentYear, currentMonth, 7),
      };
      const secondWeek = {
        start: new Date(currentYear, currentMonth, 8),
        end: new Date(currentYear, currentMonth, 14),
      };
      const thirdWeek = {
        start: new Date(currentYear, currentMonth, 15),
        end: new Date(currentYear, currentMonth, 21),
      };
      const fourthWeek = {
        start: new Date(currentYear, currentMonth, 22),
        end: new Date(currentYear, currentMonth, dayOfLastWeeks),
      };
      const [requested, approved, rejected] = await Promise.all([
        (!status || status === EActivityStatusTranslation.REQUESTED) &&
          Promise.all([
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  eq(schema.activities.status, EActivityStatus.REQUESTED),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),

                  gte(schema.activities.updatedAt, firstWeek.start),
                  lt(schema.activities.updatedAt, firstWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  eq(schema.activities.status, EActivityStatus.REQUESTED),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, secondWeek.start),
                  lt(schema.activities.updatedAt, secondWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  eq(schema.activities.status, EActivityStatus.REQUESTED),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, thirdWeek.start),
                  lt(schema.activities.updatedAt, thirdWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  eq(schema.activities.status, EActivityStatus.REQUESTED),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, fourthWeek.start),
                  lt(schema.activities.updatedAt, fourthWeek.end)
                )
              )
              .then((res) => res.length),
          ]),
        (!status || status === EActivityStatusTranslation.APPROVED) &&
          Promise.all([
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  eq(
                    schema.activities.status,
                    EActivityStatus.APPROVEDBYCHANCELLOR
                  ),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, firstWeek.start),
                  lt(schema.activities.updatedAt, firstWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  eq(
                    schema.activities.status,
                    EActivityStatus.APPROVEDBYCHANCELLOR
                  ),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, secondWeek.start),
                  lt(schema.activities.updatedAt, secondWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  eq(
                    schema.activities.status,
                    EActivityStatus.APPROVEDBYCHANCELLOR
                  ),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, thirdWeek.start),
                  lt(schema.activities.updatedAt, thirdWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  eq(
                    schema.activities.status,
                    EActivityStatus.APPROVEDBYCHANCELLOR
                  ),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, fourthWeek.start),
                  lt(schema.activities.updatedAt, fourthWeek.end)
                )
              )
              .then((res) => res.length),
          ]),
        (!status || status === EActivityStatusTranslation.REJECTED) &&
          Promise.all([
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  or(
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYDEAN
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYCHANCELLOR
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYSTUDENTGOVERMENT
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYSTUDENTCOUNCIL
                    )
                  ),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, firstWeek.start),
                  lt(schema.activities.updatedAt, firstWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  or(
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYDEAN
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYCHANCELLOR
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYSTUDENTGOVERMENT
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYSTUDENTCOUNCIL
                    )
                  ),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, secondWeek.start),
                  lt(schema.activities.updatedAt, secondWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  or(
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYDEAN
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYCHANCELLOR
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYSTUDENTGOVERMENT
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYSTUDENTCOUNCIL
                    )
                  ),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, thirdWeek.start),
                  lt(schema.activities.updatedAt, thirdWeek.end)
                )
              )
              .then((res) => res.length),
            this.drizzle
              .select({
                id: schema.activities.id,
              })
              .from(schema.activities)
              .where(
                and(
                  or(
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYDEAN
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYCHANCELLOR
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYSTUDENTGOVERMENT
                    ),
                    eq(
                      schema.activities.status,
                      EActivityStatus.REJECTEDBYSTUDENTCOUNCIL
                    )
                  ),
                  ...(role?.toLocaleLowerCase() === 'admin'
                    ? []
                    : [
                        eq(
                          schema.activities.organizationId,
                          organizationId as string
                        ),
                      ]),
                  gte(schema.activities.updatedAt, fourthWeek.start),
                  lt(schema.activities.updatedAt, fourthWeek.end)
                )
              )
              .then((res) => res.length),
          ]),
      ]);
      return {
        type: EChartType.LINE,
        month: monthIndex,
      data:{
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [
          {
            label: EActivityStatusTranslation.REQUESTED,
            backgroundColor: '#AFFFD4',
            borderColor: '#AFFFD4',
            pointBackgroundColor: '#AFFFD4',
            pointBorderColor: '#02E56D',
            pointBorderWidth: 2,
            data: requested || [],
            tention: 0.2,
          },
          {
            label: EActivityStatusTranslation.APPROVED,
            backgroundColor: '#FFF986',
            borderColor: '#FFF986',
            pointBorderColor: '#F8BF02',
            pointBorderWidth: 2,
            data: approved || [],
            pointBackgroundColor: '#FFF986',
            fill: false,
            tention: 0.2,
          },
          {
            label: EActivityStatusTranslation.REJECTED,
            backgroundColor: '#FFF986',
            borderColor: '#FFF986',
            pointBorderColor: '#F8BF02',
            pointBorderWidth: 2,
            data: rejected || [],
            pointBackgroundColor: '#FFF986',
            fill: false,
            tention: 0.2,
          },
        ],
      }
      };
    }

    if (type === EChartType.PIE && organizationId) {
      const startMonth = new Date(currentYear, currentMonth);
      const nextMonth = new Date(currentYear, currentMonth + 1);
      const [ongoing, notReported, reported] = await Promise.all([
        this.drizzle
          .select({
            id: schema.activities.id,
          })
          .from(schema.activities)
          .where(
            and(
              eq(
                schema.activities.status,
                EActivityStatus.APPROVEDBYCHANCELLOR
              ),
              ...(role?.toLocaleLowerCase() === 'admin'
                ? []
                : [
                    eq(
                      schema.activities.organizationId,
                      organizationId as string
                    ),
                  ]),
              gte(schema.activities.updatedAt, startMonth),
              lt(schema.activities.updatedAt, nextMonth)
            )
          )
          .then((res) => res.length),

        this.drizzle
          .select({
            id: schema.activities.id,
          })
          .from(schema.activities)
          .where(
            and(
              eq(schema.activities.status, EActivityStatus.NOTREPORTED),
              ...(role?.toLocaleLowerCase() === 'admin'
                ? []
                : [
                    eq(
                      schema.activities.organizationId,
                      organizationId as string
                    ),
                  ]),
              gte(schema.activities.updatedAt, startMonth),
              lt(schema.activities.updatedAt, nextMonth)
            )
          )
          .then((res) => res.length),

        this.drizzle
          .select({
            id: schema.activities.id,
          })
          .from(schema.activities)
          .where(
            and(
              eq(schema.activities.status, EActivityStatus.REPORTED),
              ...(role?.toLocaleLowerCase() === 'admin'
                ? []
                : [
                    eq(
                      schema.activities.organizationId,
                      organizationId as string
                    ),
                  ]),
              gte(schema.activities.updatedAt, startMonth),
              lt(schema.activities.updatedAt, nextMonth)
            )
          )
          .then((res) => res.length),
      ]);

      return {
        type: EChartType.PIE,
       data:{
        labels: [
          EActivityStatusTranslation.ONGOING,
          EActivityStatusTranslation.NOTREPORTED,
          EActivityStatusTranslation.REPORTED,
        ],
        datasets: [
          {
            label: 'Laporan Kegiatan',
            data: [ongoing, notReported, reported],
            backgroundColor: ['#1B81F7', '#FFB800', '34B337'],
            hoverOffset: 4,
          },
        ],
       }
      };
    }

    return {
      message: 'Data tidak tersedia',
      data:{
        labels: [],
        datasets: [],
      }
    };
  }
}
